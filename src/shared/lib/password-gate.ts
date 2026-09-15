// Browser half of the NDA gate. The shipped page contains no gated markup
// at all — PasswordGate.astro encrypts it during the build (see that
// widget's `lib/encrypt.ts`) and this decrypts it in place once the
// password is entered.
//
// This replaced a SHA-256 hash comparison (bug-073). That gate protected
// nothing: the content it guarded sat in the HTML the whole time behind
// `display: none`, so crawlers read straight through it — the medicalSoftware,
// defenceSystems, enterpriseIt, eLearning and socialVideo case studies were in Google's index with
// the real client names in them, even though the project cards showed only
// a category. The hash was also a free offline brute-force oracle sitting
// in the client bundle. Both problems are gone: a wrong password now fails
// AES-GCM's authentication tag, and the ciphertext is the only copy of the
// content on the page.
//
// Still not a server-side gate, and the ceiling is worth naming:
//   - Anyone who has the password keeps it, and can share it.
//   - Files under /media/<slug>/ stay fetchable at their direct URLs.
//     Nothing links to them while locked and the public GitHub mirror that
//     used to enumerate them is private now, but they are not access
//     controlled.
// Good enough for "a client never finds their own work in a search."

// Shared with lib/encrypt.ts on the build side — both halves have to agree
// on these or every decrypt fails. Exported rather than duplicated.
export const NDA_SALT_BYTES = 16;
export const NDA_IV_BYTES = 12;
export const NDA_KEY_BYTES = 32;
// ~0.2s on a laptop: unnoticeable on a deliberate one-off unlock, and
// expensive enough to make a dictionary run over the ciphertext painful.
export const NDA_KDF_ITERATIONS = 250_000;

/** Build output of `encryptGatedHtml`, transported as JSON in a data attribute. */
export interface NdaPayload {
  salt: string;
  iv: string;
  data: string;
}

// Holds the derived AES key (base64), not a boolean flag — every gated page
// carries its own ciphertext, so resuming an unlock on the next page needs
// the actual key, not just the knowledge that one was entered.
// sessionStorage, so it dies with the tab.
const SESSION_KEY = 'nda-key';

// One-shot announcement flag for the unlock toast (widgets/nda-unlock-toast).
// Deliberately NOT the same signal as SESSION_KEY: that one answers "is this
// session unlocked", which stays true for the rest of the tab's life, so a
// toast keyed off it would fire on every single return to the grid. This one
// answers "has the reader been told yet", and reading it clears it.
const TOAST_KEY = 'nda-unlock-toast';

// Lockout state lives in localStorage, not sessionStorage — a 2h lockout
// that resets the moment the tab closes wouldn't do anything. Same ceiling
// as the gate itself: this deters casual guessing, it doesn't stop anyone
// who clears site data or opens an incognito window.
const ATTEMPTS_KEY = 'nda-attempts';
const LOCKED_UNTIL_KEY = 'nda-locked-until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 2 * 60 * 60 * 1000;

// `Uint8Array<ArrayBuffer>` rather than a bare `Uint8Array` throughout:
// WebCrypto's BufferSource won't accept the default `ArrayBufferLike`
// parameterisation, which could be a SharedArrayBuffer.
function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function deriveKeyBytes(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array<ArrayBuffer>> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: NDA_KDF_ITERATIONS, hash: 'SHA-256' },
    material,
    NDA_KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

// Returns the plaintext HTML, or null if the key is wrong. A wrong key and
// a corrupted payload are indistinguishable here, deliberately — GCM's tag
// check is the only signal and it doesn't say which.
async function decryptPayload(
  keyBytes: Uint8Array<ArrayBuffer>,
  payload: NdaPayload,
): Promise<string | null> {
  try {
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(payload.iv) },
      key,
      base64ToBytes(payload.data),
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    return null;
  }
}

/**
 * Whether this session already holds an unlock key. Read by ProjectGrid to
 * drop the lock badge off NDA cards — it only needs the boolean, not the key.
 */
export function isNdaUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

/**
 * Decrypts using the key this session already holds, for a gated page opened
 * after the unlock happened. Null when there is no stored key, or when it
 * doesn't fit this payload (a stale key from an older build).
 */
export async function decryptWithStoredKey(payload: NdaPayload): Promise<string | null> {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored === null) return null;
  const html = await decryptPayload(base64ToBytes(stored), payload);
  if (html === null) sessionStorage.removeItem(SESSION_KEY);
  return html;
}

// Ms remaining in an active lockout, or 0 if none — clearing a stale/expired
// lockout (and its attempt counter) as a side effect of the check.
export function getLockoutRemainingMs(): number {
  if (typeof window === 'undefined') return 0;
  const until = Number(localStorage.getItem(LOCKED_UNTIL_KEY));
  if (!until) return 0;
  const remaining = until - Date.now();
  if (remaining <= 0) {
    localStorage.removeItem(LOCKED_UNTIL_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    return 0;
  }
  return remaining;
}

/**
 * Attempts an unlock. Returns the decrypted HTML on success (and remembers
 * the key for the rest of the session), or null on a wrong password or an
 * active lockout.
 */
export async function tryUnlockNda(
  password: string,
  payload: NdaPayload,
): Promise<string | null> {
  if (getLockoutRemainingMs() > 0) return null;

  const keyBytes = await deriveKeyBytes(password, base64ToBytes(payload.salt));
  const html = await decryptPayload(keyBytes, payload);

  if (html !== null) {
    sessionStorage.setItem(SESSION_KEY, bytesToBase64(keyBytes));
    sessionStorage.setItem(TOAST_KEY, '1');
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKED_UNTIL_KEY);
    return html;
  }

  const attempts = Number(localStorage.getItem(ATTEMPTS_KEY)) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKED_UNTIL_KEY, String(Date.now() + LOCKOUT_MS));
    localStorage.removeItem(ATTEMPTS_KEY);
  } else {
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));
  }
  return null;
}

/**
 * Whether a fresh unlock is still waiting to be announced. True exactly once
 * per unlock — the act of reading it clears the flag.
 *
 * Only `tryUnlockNda` arms this. `decryptWithStoredKey` deliberately does not:
 * that is the resume path, taken when a gated page is opened or reloaded after
 * the unlock already happened, and arming it there would re-announce an unlock
 * the reader performed several pages ago.
 */
export function consumeNdaUnlockToast(): boolean {
  if (typeof window === 'undefined') return false;
  const pending = sessionStorage.getItem(TOAST_KEY) !== null;
  if (pending) sessionStorage.removeItem(TOAST_KEY);
  return pending;
}

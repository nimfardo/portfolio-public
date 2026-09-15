/**
 * Flags "the page has been scrolled" as `data-scrolled` on <html>, so chrome
 * that sits over the content — the desktop PageHeader, the mobile nav header —
 * can fade a backdrop in instead of carrying one at rest (feat-159).
 *
 * On <html> rather than a class on each header: both headers need the same
 * state, they live in different components, and one of them (the mobile
 * header) is `transition:persist` while the other is re-rendered per page. A
 * single root attribute is the only place all of them can read the same
 * answer without passing anything between components.
 *
 * THRESHOLD is 8px, not 0. At 0 the attribute flickers on and off during the
 * sub-pixel settle at the top of the page (and on trackpad rubber-banding in
 * Safari), which reads as the header's backdrop strobing. 8px is below the
 * point where any content has visibly moved under the header, so the fade
 * still looks like it fires the moment the page moves.
 */
const THRESHOLD = 8;

let bound = false;

function sync(): void {
  const scrolled = window.scrollY > THRESHOLD;
  const root = document.documentElement;
  // Touching the attribute on every frame would invalidate style for the
  // whole document each time; only write on an actual edge.
  if (scrolled === root.hasAttribute('data-scrolled')) return;
  if (scrolled) {
    root.setAttribute('data-scrolled', '');
  } else {
    root.removeAttribute('data-scrolled');
  }
}

export function initScrollState(): void {
  if (typeof window === 'undefined') return;

  // Runs on every astro:page-load, bind only once. The listener is on
  // `window`, which survives ClientRouter swaps, so re-binding would stack
  // handlers — the same reason ScrollToTop reaches for bindOncePersisted on
  // its own persisted node.
  if (!bound) {
    bound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          sync();
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  // Always re-sync, bound or not. A client-side navigation lands at a new
  // scroll position without firing `scroll`, so a page entered at the top
  // from a scrolled one would otherwise keep the stale attribute and open
  // with a backdrop it should not have.
  sync();
}

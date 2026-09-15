// Generates the NDA unlock toast's padlock Lottie, in both theme colours.
//
//   node scripts/build-lock-lottie.mjs
//     -> public/media/ui/lock-unlock.json        (dark:  --color-icon-default #efcba6)
//     -> public/media/ui/lock-unlock-light.json  (light: --color-icon-default #2f1c08)
//
// This exists because every free Lottie we could have downloaded is blocked
// by its own licence for this repo: UseAnimations is CC-BY and forbids
// redistribution, Lordicon's free tier demands a visible credit, and
// LottieFiles' Simple License forbids distributing the file in a way that
// lets it be downloaded separately — which is exactly what public/media/ plus
// the public GitHub mirror does. Authoring it from our own glyph sidesteps all
// of that AND is the only way the motion matches the icon library exactly.
//
// The geometry is locker.svg's, decoded rather than redrawn:
//   body    outer 3,12->25,26 against inner 5,14->23,24 == a 2px stroke on
//           the 20x12 rect centred at (14,19)
//   shackle outer r=7 / inner r=5 about (14,9) == a centreline r=6 arc at
//           stroke-width 2, legs ending flat at y=12 (butt caps)
//   slot    the filled 2x4 rect centred at (14,20)
// Keep those numbers in sync with NdaUnlockToast.astro's static fallback if
// the icon ever changes; both derive from the same source file.
//
// Unlike AnimatedFlame, whose tracing pipeline was scratch-only and is gone,
// this generator is the source of truth and lives in the repo. Editing the
// motion means editing the TIMELINE table below and re-running, not hand-
// patching JSON. The emitted file is also a plain Lottie, so it opens in
// LottieFiles or After Effects for a visual retime.

import { writeFileSync } from 'node:fs';

const FPS = 60;
const OUT_POINT = 68; // 1.133s

// Circle -> cubic bezier constant. A quarter arc's control points sit
// k * r along the tangent; at r=6 that is 3.3137.
const K = 0.5522847498307936;
const R = 6;
const T = +(K * R).toFixed(4);

const hexToLottie = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1].map(
    (v) => +v.toFixed(5),
  );
};

// --- the timeline, in frames at 60fps -------------------------------------
// Everything about how this reads lives here. The shape data below is fixed.
const TIMELINE = {
  slotStart: 8, // 133ms — a beat of stillness first, so the turn is noticed
  slotEnd: 26, // 433ms
  windUp: 24, // the shackle loads while the slot is still finishing
  release: 30, // 500ms
  peak: 44, // 733ms — overshoot
  settle: 56, // 933ms — back under the target
  rest: 64, // 1067ms
};
// Degrees, POSITIVE = clockwise = the left leg lifts out of the body, which
// is how a padlock hinged on its right leg actually opens. Lottie's layer
// rotation maps 1:1 onto an SVG rotate() here, so these match the static
// fallback's transform exactly. Verified numerically, not by eye: at rest the
// left leg's base (8,12) must land at (9.61, 6) — see scripts' sibling probe
// in the commit message. A NEGATIVE value swings the leg DOWN through the
// body, which looks plausible in a thumbnail and is wrong.
const ANTICIPATION = -4; // presses INTO the body before it lets go
const OVERSHOOT = 34;
const UNDERSHOOT = 29.2;
const OPEN = 30;

// cubic-bezier(ox, oy, ix, iy) as Lottie's per-keyframe in/out tangents.
const ease = (ox, oy, ix, iy) => ({ o: { x: [ox], y: [oy] }, i: { x: [ix], y: [iy] } });
const EASE_IN_OUT = ease(0.45, 0, 0.25, 1);
// Snappy, but NOT degenerate. The first attempt at this was
// cubic-bezier(0.05, 0.7, 0.1, 1), which covered 74% of the swing in its
// first two frames — that reads as a pop, not a release, and it is exactly
// the "raw" quality this whole change was meant to remove. Measured ceiling
// now: no frame moves the shackle more than ~5 degrees.
const EASE_OUT = ease(0.22, 0.55, 0.28, 1);
const EASE_SETTLE = ease(0.4, 0, 0.3, 1);

const kf = (t, s, e) => (e ? { t, s: [s], ...e } : { t, s: [s] });

const transform = () => ({
  ty: 'tr',
  p: { a: 0, k: [0, 0] },
  a: { a: 0, k: [0, 0] },
  s: { a: 0, k: [100, 100] },
  r: { a: 0, k: 0 },
  o: { a: 0, k: 100 },
  sk: { a: 0, k: 0 },
  sa: { a: 0, k: 0 },
});

const stroke = (color) => ({
  ty: 'st',
  c: { a: 0, k: color },
  o: { a: 0, k: 100 },
  w: { a: 0, k: 2 },
  lc: 1, // butt — locker.svg's legs end flat
  lj: 1, // miter — the body's corners are square
  ml: 4,
  nm: 'stroke',
});

const fill = (color) => ({
  ty: 'fl',
  c: { a: 0, k: color },
  o: { a: 0, k: 100 },
  r: 1,
  nm: 'fill',
});

const layer = (ind, nm, shapes, ks, parent) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm,
  sr: 1,
  ks: { o: { a: 0, k: 100 }, s: { a: 0, k: [100, 100, 100] }, ...ks },
  ao: 0,
  shapes,
  ip: 0,
  op: OUT_POINT,
  st: 0,
  bm: 0,
  ...(parent ? { parent } : {}),
});

function build(hex) {
  const color = hexToLottie(hex);

  // Shackle: leg up, semicircle over the top, leg down. Open path.
  const shacklePath = {
    ty: 'sh',
    ind: 0,
    ks: {
      a: 0,
      k: {
        c: false,
        v: [
          [8, 12],
          [8, 9],
          [14, 3],
          [20, 9],
          [20, 12],
        ],
        o: [
          [0, 0],
          [0, -T],
          [T, 0],
          [0, 0],
          [0, 0],
        ],
        i: [
          [0, 0],
          [0, 0],
          [-T, 0],
          [0, -T],
          [0, 0],
        ],
      },
    },
    nm: 'shackle-path',
  };

  const layers = [
    // Hinged on the RIGHT leg's base (20,12): in Lottie's y-down space a
    // positive rotation is clockwise, which is what lifts the LEFT leg out
    // of the body — the way a padlock actually opens.
    layer(1, 'shackle', [{ ty: 'gr', it: [shacklePath, stroke(color), transform()], nm: 'g' }], {
      p: { a: 0, k: [20, 12, 0] },
      a: { a: 0, k: [20, 12, 0] },
      r: {
        a: 1,
        k: [
          kf(0, 0, EASE_IN_OUT),
          kf(TIMELINE.windUp, 0, EASE_IN_OUT),
          kf(TIMELINE.release, ANTICIPATION, EASE_OUT),
          kf(TIMELINE.peak, OVERSHOOT, EASE_SETTLE),
          kf(TIMELINE.settle, UNDERSHOOT, EASE_SETTLE),
          kf(TIMELINE.rest, OPEN),
        ],
      },
    }),
    // Parented to the body so it inherits the recoil.
    layer(
      2,
      'slot',
      [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', d: 1, s: { a: 0, k: [2, 4] }, p: { a: 0, k: [14, 20] }, r: { a: 0, k: 0 } },
            fill(color),
            transform(),
          ],
          nm: 'g',
        },
      ],
      {
        p: { a: 0, k: [14, 20, 0] },
        a: { a: 0, k: [14, 20, 0] },
        r: {
          a: 1,
          k: [kf(TIMELINE.slotStart, 0, EASE_IN_OUT), kf(TIMELINE.slotEnd, 90)],
        },
      },
      3,
    ),
    // Recoil: the body takes the shackle's release, half a unit and back.
    layer(
      3,
      'body',
      [
        {
          ty: 'gr',
          it: [
            {
              ty: 'rc',
              d: 1,
              s: { a: 0, k: [20, 12] },
              p: { a: 0, k: [14, 19] },
              r: { a: 0, k: 0 },
            },
            stroke(color),
            transform(),
          ],
          nm: 'g',
        },
      ],
      {
        a: { a: 0, k: [14, 19, 0] },
        p: {
          a: 1,
          k: [
            { t: TIMELINE.release, s: [14, 19, 0], ...ease(0.3, 0, 0.2, 1) },
            { t: TIMELINE.release + 4, s: [14, 19.45, 0], ...ease(0.4, 0, 0.3, 1) },
            { t: TIMELINE.peak, s: [14, 19, 0] },
          ],
        },
      },
    ),
  ];

  return {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: OUT_POINT,
    w: 28,
    h: 28,
    nm: 'lock-unlock',
    ddd: 0,
    assets: [],
    layers,
  };
}

for (const [file, hex] of [
  ['public/media/ui/lock-unlock.json', '#efcba6'],
  ['public/media/ui/lock-unlock-light.json', '#2f1c08'],
]) {
  writeFileSync(file, JSON.stringify(build(hex)));
  console.log('wrote', file, hex);
}

import type {
  BlocksSection,
  ContentBlock,
  GalleryRow,
  ProjectMedia,
  ProjectContent,
} from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Arvus, node
// 2523:1717) as fixed by copy-012 and copy-014, not
// reference/content/copy-deck.md — the deck still holds the older Arvus copy
// and is stale for CONNECTIS and medicalSoftware too.
//
// Structurally the simplest case study so far: no process accordion (one
// media block, like defenceSystems), no Build section, no video interstitial, no link
// cards, no stats. Arvus is access:'public' in projects.ts, so unlike defenceSystems and
// medicalSoftware nothing here sits behind the password gate.
//
// The one new capability this page needed is a video in a gallery slot
// (feat-041) — the tall slot plays the product's own loading animation.

const M = '/media/arvus';

export const arvus = {
  slug: 'arvus',
  name: 'Arvus',
  // Frame 2523:1724 exported composed — dark background, the brand gradient
  // and the ARVUS logo lockup all baked into one image, because ProjectHero
  // takes a single media slot. The source image is wider than the frame and
  // clipped by it, so the export is the cropped result rather than the raw
  // fill (bug-045's lesson about preferring the composed export).
  hero: {
    type: 'image',
    image: `${M}/hero.jpg`,
    imageAlt:
      'The ARVUS wordmark beside an operator monitor: a six-tile video wall watching a parking complex, above an incident table with a critical unauthorized-vehicle alert',
  } satisfies ProjectMedia,
  overview: {
    heading: 'Project Overview',
    text: 'Arvus is a browser-based PSIM console — cameras, sensors, and access control in one operator view.',
    // Slot 1 is the domain, matching CONNECTIS ('Logistics') and medicalSoftware
    // ('Medical') — copy-012 corrected it from 'PSIM System', which named the
    // product category instead. Slot 2 read 'Solo UX/UI designer' until
    // copy-045 (2026-09-15), on the reasoning that identity.md barred the
    // Product Designer title outright. That bar is retired — see that file's
    // Positioning section — so the slot now says what the work was: Max ran
    // the research and the specs with the Product Owner, no PM in between,
    // which is product design whatever the contract called it. It is still
    // NOT the code pages' 'design engineer': Arvus shipped no code, and that
    // title would overclaim.
    tags: [
      'Security',
      'Solo product designer',
      'Research · Wireframes · Brand · Prototype · Testing · Design system',
      '2023–2024',
    ],
  },
  // One media block, like defenceSystems — not CONNECTIS's 4-step accordion.
  challenge: {
    heading: 'Challenge',
    blocks: [
      {
        media: {
          type: 'image',
          image: `${M}/challenge.jpg`,
          imageAlt:
            'The problem statement — "The tools are failing the people" — over four cards: tool fragmentation, high cost of entry, alert fatigue, and a steep learning curve',
        },
        text: 'More data, less clarity: operators juggle disconnected tools under constant time pressure.',
      },
    ] satisfies ContentBlock[],
  },
  process: {
    heading: 'Process',
    blocks: [
      {
        media: {
          type: 'image',
          image: `${M}/process.jpg`,
          imageAlt:
            'The Design Thinking timeline, Discover through Deliver: stakeholder brief, market research, operator and integrator surveys and interviews, pain-point mapping, information architecture, brand concept, lo-fi wireframes, UI design, five usability-testing sessions, design-system handoff',
        },
        text: 'Design Thinking, adapted: no PM, so I ran research and specs with the Product Owner.',
      },
    ] satisfies ContentBlock[],
  } satisfies BlocksSection,
  // Two blocks (copy-014). Max added the Brand Concept still to canvas
  // himself; the block order is brand/design-system first, then the product,
  // and each caption is measured at 3 lines at 1280px.
  deliverables: {
    heading: 'Deliverables',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/deliverables.webm`,
          poster: `${M}/deliverables-poster.jpg`,
          alt: 'The brand concept — precision, intelligence, accessibility — then the design system: Poppins type scale, colour palette, icon set and atomic architecture, ending on the full screen library',
        },
        text: 'Brand guidelines, a design system, and a responsive web app for integrators and operators.',
      },
      {
        media: {
          type: 'video',
          src: `${M}/flow.webm`,
          poster: `${M}/flow-poster.jpg`,
          alt: 'The product in use: an incident table filling with critical alerts, a building floor plan with device markers and a PA/audio configuration dialog, then the layout editor arranging video tiles',
        },
        text: 'A layout editor for video walls, with every device mapped onto the real floor plan.',
      },
    ] satisfies ContentBlock[],
  },
  // Renders after Deliverables, before whatever evidence this page carries.
  // Figures are unsigned by design (see OutcomesData in model/types.ts):
  // direction lives in the label, and count-up.ts only rolls the first run
  // of digits, so whole numbers only and no before/after arrows in `value`.
  // Method: (was carried inline as "n=5" in a label until copy-046 — it
  //   was the only page doing that once the rendered notes went.)
  //   Response time from the five moderated sessions named in the Process
  //   section — a small sample, and I say so. Onboarding from the
  //   integrator’s training schedule before and after.
  // Cut to two (copy-048): dropped "5 of 5 Operators finished unassisted".
  //   Smallest signal of the three. The Challenge names alert fatigue and a
  //   steep learning curve; the two kept answer those.
  outcomes: {
    heading: 'Outcomes',
    stats: [
      { value: '44', unit: '%', label: 'Faster response to critical alerts' },
      { value: '67', unit: '%', label: 'Shorter onboarding, 3 days → 1' },
    ],
  },
  // Figma's Frame 14 (node 2587:4617) is the tall-plus-two-stacked shape
  // CONNECTIS and medicalSoftware already use. The tall slot is a video here — the
  // first one any gallery has held (feat-041). There is deliberately no
  // gallery-1.jpg: that slot is preloader.webm.
  gallery: [
    {
      type: 'split',
      tall: {
        type: 'video',
        src: `${M}/preloader.webm`,
        poster: `${M}/preloader-poster.jpg`,
        alt: "Arvus's loading screen — the network-node logo mark drawing itself on the blue brand gradient",
      },
      stack: [
        {
          type: 'image',
          image: `${M}/gallery-2.jpg`,
          imageAlt:
            'An operator monitor for the Westfield Parking Complex — a parking-deck camera feed above a car stopped at the barrier, with the incident table below flagging one row critical in red',
        },
        {
          type: 'image',
          image: `${M}/gallery-3.jpg`,
          imageAlt:
            'The integrator view — a 3D floor plan with device markers placed through it on a tablet, beside the full grid of colour-coded device icons',
        },
      ],
    },
  ] satisfies GalleryRow[],
  retrospective: {
    heading: "What I've Learned",
    text: "Operators don't want more views. They want the one view that matches their building.",
    // Full URL supplied by Max in chat; copy-deck.md only carried the bare
    // gallery id (246830933).
    behanceUrl: 'https://www.behance.net/gallery/246830933/PSIM-Security-Platform',
  },
} satisfies ProjectContent;

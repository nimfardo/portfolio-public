import type {
  ContentBlock,
  GalleryRow,
  ProcessStep,
  ProjectContent,
  ProjectMedia,
} from '../model/types';

// Content pulled from the live Figma canvas (Project Page/CONNECTIS
// (Revised), node 2165:2), not reference/content/copy-deck.md — the two
// have drifted (see STATE.md Known Issues); canvas is the source of truth.

const M = '/media/connectis';

export const connectis = {
  slug: 'connectis',
  name: 'CONNECTIS',
  // Figma dropped the hero's tags/eyebrow/headline card — it's now a bare
  // image + scroll cue. The "Challenge" eyebrow/headline that used to live
  // here moves to its own ContentSection-style block in Task 3, sourced
  // fresh from canvas rather than carried over guessed.
  //
  // Now a video (feat-031). It opens on a black fade-in, so the poster is
  // pulled from the dashboard shot at t=3s rather than frame 0 — that's the
  // only still phone users see, since Media gates video autoplay to tablet
  // width and up.
  hero: {
    type: 'video',
    src: `${M}/hero.webm`,
    poster: `${M}/hero-poster.jpg`,
    alt: "CONNECTIS in use — a fleet operator's dual-monitor setup showing the Analytics & Reports and Dashboard screens above a full vehicle lot, cutting to a driver's view of an open road",
  } satisfies ProjectMedia,
  overview: {
    heading: 'Project Overview',
    // 92 chars, measured at 3 lines at 1280px (copy-013). The previous
    // wording was 105 and laid out at 4 — copy-009's "every body text at 3
    // lines" pass covered the ContentSection captions and the retro, not this
    // slot. Active voice also leads with the change rather than the category.
    text: 'CONNECTIS replaces spreadsheets and phone calls with one command center for fleet operators.',
    tags: [
      'Logistics',
      'Solo product designer',
      'Research · UX/UI · Brand · Prototype · Motion',
      '2026',
    ],
  },
  // Figma reverted the per-step icons (feat-028) back to plain numbers, and
  // dropped the media from steps 03/04 — `media` is optional now, and those
  // two steps render as title + paragraph only.
  process: [
    {
      number: '01',
      title: 'AI-driven Product Strategy and Framing',
      media: {
        type: 'image',
        image: `${M}/process/step1-what.jpg`,
        imageAlt:
          'Research deliverables: market research, user personas, journey mapping, problem framing',
      },
      body: 'Accelerated market research, user personas, journey mapping, and problem framing using AI. Compressed discovery and scoping from months to days without sacrificing depth.',
    },
    {
      number: '02',
      title: 'Tokenized Design System and Architecture',
      media: {
        type: 'video',
        src: `${M}/process/step2-what.webm`,
        poster: `${M}/process/step2-what-poster.jpg`,
        alt: "Hand-sketching CONNECTIS's lo-fi wireframes on paper — dashboard, analytics and reports, vehicles, and settings screens — next to a laptop",
      },
      body: 'Built sitemaps, user stories, and lo-fi wireframes into a high-fidelity Figma component library with Level-II token architecture for light and dark modes. Delivered a systematic design foundation structured for fast, accurate AI translation.',
    },
    {
      number: '03',
      title: 'Figma-to-Claude Integration and Documentation',
      body: 'Used Claude to parse Figma layouts, design tokens, and visual direction directly. Automated generation of PRDs, user flows, and precise UI reference specs from a single source of truth.',
    },
    {
      number: '04',
      title: 'AI-assisted Build and PoC Delivery',
      body: 'Fed design data straight into code-generation pipelines for instant iteration, then immediately usability-tested the output. Replaced slow handoffs to build and validate a working PoC in record time.',
    },
  ] satisfies ProcessStep[],
  // Figma's old "Deliverables" eyebrow/headline interstitial banner ("A
  // design system, shipped as a working product.") is gone — replaced by
  // the Challenge block below (real content, not a banner) and the merged
  // Deliverables section immediately after it.
  // Same {heading, blocks} shape as deliverables below — ContentSection
  // renders both, Challenge just happens to have a single block.
  challenge: {
    heading: 'Challenge',
    blocks: [
      {
        media: {
          type: 'image',
          image: `${M}/challenge.jpg`,
          imageAlt: 'CONNECTIS — a fleet operations manager in a glass-walled meeting room',
        },
        text: 'Transform fragmented data into prioritized actions to prevent downtime.',
      },
    ] satisfies ContentBlock[],
  },
  // Brand Development + Design System used to be two separately-headed
  // sections; Figma merged them under one "Deliverables" heading with both
  // caption blocks stacked underneath. Both are videos as of feat-032.
  deliverables: {
    heading: 'Deliverables',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/deliverables-pages.webm`,
          poster: `${M}/deliverables-pages-poster.jpg`,
          alt: "CONNECTIS's hi-fi desktop screens in dark mode — alerts, sign-up, the fleet map, financial breakdown, and vehicle roster — pushing in to a close-up of the dashboard's health score and action-needed queue",
        },
        text: 'Hi-fi desktop screens from sign-in to the asset page, in light and dark modes, with 100% auto-layout structure.',
      },
      {
        media: {
          type: 'video',
          src: `${M}/brand-development.webm`,
          poster: `${M}/brand-development-poster.jpg`,
          alt: 'CONNECTIS brand identity — the connected-network monogram drawn on its geometric construction grid, the app icon sitting in a macOS dock, and the Michroma typeface specimen',
        },
        text: 'Geometric precision: a Michroma wordmark, zero decoration, and one connected network mark for the fleet.',
      },
      {
        media: {
          type: 'video',
          src: `${M}/design-system.webm`,
          poster: `${M}/design-system-poster.jpg`,
          alt: "CONNECTIS's token architecture — a radial map of the two tiers, then the reference layer's full colour ramps, then the semantic layer wired on top of them",
        },
        text: 'A 2-tiered token system — a foundational reference layer feeding a semantic layer built for the product.',
      },
    ] satisfies ContentBlock[],
  },
  build: {
    // Was an interactive Mermaid sitemap (feat-027) rendered through
    // ZoomPan; Max replaced it with footage of the real build.
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/build.webm`,
          poster: `${M}/build-poster.jpg`,
          alt: 'Building CONNECTIS — a Claude Code session running in the terminal, then the dashboard it produced: fleet health score, live incident map, and the action-needed queue',
        },
        text: 'Full auth and role-based access, sign-in to sign-out. Supabase simulates a fleet of 50+ vehicles.',
      },
      // The Glacier Flow block is shared with defenceSystems's Build section — same
      // video file (public/media/shared/), same text, synced from canvas
      // nodes 2495:1545/2441:7604 (copy-008's 3-line cap applies).
      {
        media: {
          type: 'video',
          src: '/media/shared/glacier-flow.webm',
          poster: '/media/shared/glacier-flow-poster.jpg',
          alt: "Glacier Flow's title card, then a scroll through the template's public GitHub README — core idea, folder map, and the gated task workflow",
        },
        text: 'I use Glacier Flow, a Claude Code template: folder routing, a knowledge base, and gated tasks.',
      },
    ] satisfies ContentBlock[],
    stats: [
      { value: '394', label: 'Commits, One Month' },
      // feat-032 swapped this for "3 / Roles, One Codebase"; Max's approved
      // canvas (copy-008 review, 2026-08-06) has 76 KB back — he re-edited
      // the section and kept it, so this is deliberate, not stale.
      { value: '76', unit: 'KB', label: 'Initial JS Bundle' },
    ],
    githubUrl: 'https://github.com/nimfardo/glacier-flow',
  },
  // Outcomes sit AFTER Deliverables and BEFORE Build, so the page reads
  // "what I made -> what it changed -> how it was built". The two figures in
  // `build.stats` above stay where they are: 394 commits and a 76 KB bundle
  // are craft metrics about the build, and they belong beside the build
  // footage, not in a section about what the product did for the operator.
  // Method: Triage and task success from moderated tests I ran on the PoC (n=8),
  //   timed against the operator’s current spreadsheet flow.
  //   Vehicle-off-road figure models their own 2025 incident log through the
  //   dashboard.
  outcomes: {
    heading: 'Outcomes',
    stats: [
      { value: '68', unit: '%', label: 'Faster incident triage, 7.9 → 2.4 min' },
      { value: '92', unit: '%', label: 'Task success, up from 58%' },
      { value: '31', unit: '%', label: 'Fewer days with vehicles off road' },
    ],
  },
  video: {
    src: `${M}/sign-in-dashboard.webm`,
    poster: `${M}/sign-in-dashboard-poster.jpg`,
    alt: 'CONNECTIS product walkthrough — sign-in screen through to the fleet dashboard',
  },
  // gallery-1.jpg (the old lead shot) was the same sign-in scene the video
  // above now opens on -- dropped to avoid showing that shot twice on the
  // page (2026-07-28).
  gallery: [
    {
      type: 'split',
      // Every gallery slot is a ProjectMedia since feat-041 (Arvus needed a
      // video in a tall slot). Alt text is real now — these three were empty
      // on the decorative-media reasoning the GalleryRow doc comment retires.
      tall: {
        type: 'image',
        image: `${M}/gallery-2.jpg`,
        imageAlt:
          'The fleet map at night with a vehicle card over it — a Hyundai Ioniq 5 at 40% battery and 76 km/h — beside a health score of 89% split into healthy, warning and critical counts',
      },
      stack: [
        {
          type: 'image',
          image: `${M}/gallery-3.jpg`,
          imageAlt:
            'Hand-drawn wireframes on spiral pads, shot in black and white — sheets labelled Dashboard and Analytics and Reports, pencilled out beside the pencil that drew them',
        },
        {
          type: 'image',
          image: `${M}/gallery-4.jpg`,
          imageAlt:
            'The CONNECTIS app icon on a dark grid — a letter C drawn as a network of connected nodes',
        },
      ],
    },
  ] satisfies GalleryRow[],
  retrospective: {
    heading: "What I've Learned",
    text: 'A production-ready PoC built, tested, and validated in record time.',
    behanceUrl: 'https://www.behance.net/gallery/251016127/CONNECTIS-Fleet-Intelligence-Platform',
  },
} satisfies ProjectContent;

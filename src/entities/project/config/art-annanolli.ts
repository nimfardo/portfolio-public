import type {
  BlocksSection,
  ContentBlock,
  GalleryRow,
  ProjectMedia,
  ProjectContent,
} from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Generic filled for
// Art Annanolli, node 2595:9635), not reference/content/copy-deck.md — the deck
// has no entry for this project at all and is stale for CONNECTIS, medicalSoftware and
// Arvus too.
//
// Structurally identical to Arvus: no process accordion, no Build section, no
// video interstitial, no link cards, no stats. Challenge, Process and
// Deliverables are one media block each, and the gallery is the `split` row with
// a video in the tall slot. Every capability already existed — video in a
// ContentSection since feat-032, video in a gallery slot since feat-041 — so
// this page needed no widget or prop changes.
//
// The oldest work on the site (2020) and the only one where Max both designed
// and built: the site shipped on Webflow, which is what the role tag claims.

const M = '/media/art-annanolli';

export const artAnnanolli = {
  slug: 'art-annanolli',
  name: 'Art Annanolli',
  // Behance cover, cropped to the hero's 1647x800 box. Kept at its native
  // 2146x1042 rather than Figma's 1x render of the same image: the aspect
  // ratios match to four decimals (2.0595 vs 2.0588), so there is no framing
  // difference, and the source has no more pixels than this to give.
  hero: {
    type: 'image',
    image: `${M}/hero.jpg`,
    imageAlt:
      'The Annanolli site on a tablet — the headline "Viivalla rumuutta vastaan" beside a photo of Tero in a red cap holding a paintbrush, set over one of his pale watercolours',
  } satisfies ProjectMedia,
  overview: {
    heading: 'Project Overview',
    text: 'Tero Annanolli paints, teaches, and runs an academy. One site now carries all three.',
    // Slot 1 is the domain, matching CONNECTIS ('Logistics'), medicalSoftware
    // ('Medical') and Arvus ('Security') — not the product category. Slot 2
    // names the build because Max owned it here: unlike Arvus ('Solo UX/UI
    // designer', design only) and unlike the code pages ('Solo design
    // engineer'), this one shipped on Webflow by his own hand, so 'Webflow
    // developer' is the accurate claim — it is chosen for accuracy, not to dodge
    // 'UI/UX designer', which identity.md now permits as depth (never a
    // headline) rather than banning outright.
    tags: [
      'Art',
      'Solo designer and Webflow developer',
      'Research · Wireframes · Brand · Foundations · UI design',
      '2020',
    ],
  },
  // One media block, like defenceSystems and Arvus — not CONNECTIS's 4-step accordion.
  // The video is the case for the copy: it cycles the rejected directions.
  challenge: {
    heading: 'Challenge',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/challenge.webm`,
          poster: `${M}/challenge-poster.jpg`,
          alt: 'Three homepage directions in sequence — a dark navy layout, then a washed-out light one, then the approved design with Tero standing against his own bird painting',
        },
        text: 'A creative client knows what he does not want. Finding the direction took five redesigns.',
      },
    ] satisfies ContentBlock[],
  },
  process: {
    heading: 'Process',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/process.webm`,
          poster: `${M}/process-poster.jpg`,
          alt: "The UX track — a user-flow diagram of the site's pages, an isometric field of over twenty wireframes, then the spacing scale, twelve-column layout grid and colour swatches",
        },
        text: 'I mapped the flow, then drew twenty wireframes, so we settled structure before style.',
      },
    ] satisfies ContentBlock[],
  } satisfies BlocksSection,
  deliverables: {
    heading: 'Deliverables',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/deliverables.webm`,
          poster: `${M}/deliverables-poster.jpg`,
          alt: 'The finished About page scrolling — the headline, a press clipping, the artist biography, and the closing Yhteystiedot contact form',
        },
        text: 'Ten page designs on one type, colour, and spacing base, with the motion for handoff.',
      },
    ] satisfies ContentBlock[],
  },
  // Renders after Deliverables, before whatever evidence this page carries.
  // Figures are unsigned by design (see OutcomesData in model/types.ts):
  // direction lives in the label, and count-up.ts only rolls the first run
  // of digits, so whole numbers only and no before/after arrows in `value`.
  // Method: I built the site on Webflow, so the analytics were mine. Form
  //   submissions over sessions, measured before and after launch.
  outcomes: {
    heading: 'Outcomes',
    stats: [
      { value: '6', unit: '%', label: 'Contact conversion, up from 2%' },
      { value: '118', unit: '%', label: 'More course enquiries, 6 months' },
    ],
  },
  // The `split` shape CONNECTIS, medicalSoftware and Arvus all use. Tall slot is a
  // video (feat-041); both stacked slots carry real alt text, like every other
  // gallery on the site now (see the GalleryRow doc comment).
  gallery: [
    {
      type: 'split',
      tall: {
        type: 'video',
        src: `${M}/pages.webm`,
        poster: `${M}/pages-poster.jpg`,
        alt: 'The built site scrolling through its pages — the services page, then the course page with its pricing and paint-tray photos, ending on the contact form',
      },
      stack: [
        {
          type: 'image',
          image: `${M}/gallery-2.jpg`,
          imageAlt:
            "One of Tero's paintings — lemons on the branch over washes of pale turquoise, signed in the corner",
        },
        {
          type: 'image',
          image: `${M}/gallery-3.jpg`,
          imageAlt:
            'The Taideteokset gallery page on the finished site — category tabs, a year selector, and a row of artwork cards with a round-cropped bird painting centred',
        },
      ],
    },
  ] satisfies GalleryRow[],
  retrospective: {
    heading: "What I've Learned",
    text: 'Five redesigns taught me to settle the foundations first. Style arguments end there.',
    behanceUrl: 'https://www.behance.net/gallery/102657167/Finnish-visual-artist-Tero-Annanolli',
  },
} satisfies ProjectContent;

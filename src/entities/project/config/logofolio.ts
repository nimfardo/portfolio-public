import type { GalleryRow, ProjectContent, ProjectMedia } from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Logofolio,
// node 2997:2425), copy-edited in place there (copy-031) before this port:
// the Overview paragraph was a run-on with awkward phrasing, the overview
// heading said "Overview" instead of every other page's "Project Overview",
// the tags were lowercase with a hyphen in the year range, and the
// Retrospective paragraph was a broken sentence fragment ("That the right
// association..."). All fixed on canvas first, then ported.
//
// Structurally the simplest page on the site: no challenge, no process
// accordion, no deliverables, no build section, no video interstitial —
// just hero, overview, a 12-image gallery of individual logo marks, and a
// retrospective. Every gallery slot is `full` (no `split` rows, unlike
// art-annanolli/Arvus/CONNECTIS), because the canvas has no tall+stack
// pairing here, only a flat sequence of 1647x800 project-hero-image frames.
//
// Those frames are 1647x800, but ProjectGallery's `full` row is a fixed
// 1647/1000 aspect ratio (object-fit: cover) — every logo mark sits
// centered in its frame, so the crop is safe. Not worth a new row shape
// for one page.

const M = '/media/logofolio';

export const logofolio = {
  slug: 'logofolio',
  name: 'Logofolio',
  hero: {
    type: 'image',
    image: `${M}/hero.jpg`,
    imageAlt:
      'A canyon shrouded in warm, misty haze, with the Logofolio wordmark in blackletter type centered over it',
  } satisfies ProjectMedia,
  overview: {
    heading: 'Project Overview',
    // The "Mdt" mark's own construction diagram — grid, circles and
    // proportion callouts (0.14x/0.63x/1x) — the anchor image for this
    // section on canvas, above the statement and tags.
    image: {
      type: 'image',
      image: `${M}/overview.jpg`,
      imageAlt:
        'A construction diagram for the Mdt monogram — golden-ratio circles, grids and proportion callouts (0.14x, 0.63x, 1x) around the blackletter mark',
    } satisfies ProjectMedia,
    text: 'Logofolio is my collection of logotypes and brand marks — made for clients, and made for myself.',
    tags: ['Branding', 'Graphic designer', 'Identity', '2019–2026'],
  },
  // "At a glance", not "Outcomes", and countable facts rather than business
  // claims: .context/identity.md Product Principle #2 forbids outcome claims
  // on the two showcase pages. Both figures here are checkable — the marks
  // are countable in the gallery below, and the payload is re-measurable
  // from the shipped .json.
  outcomes: {
    heading: 'At a glance',
    stats: [
      { value: '12', label: 'Marks shipped, 2019–2026' },
      { value: '6', label: 'Variants tested per mark' },
    ],
  },
  gallery: [
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-1.jpg`,
        imageAlt:
          'The Mdt monogram in blackletter type, centered over a photo of pine forest reflected in a still lake',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-2.jpg`,
        imageAlt: 'The CONNECTIS mark, a constellation of connected dots forming a C, above the wordmark on black',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-3.jpg`,
        imageAlt: 'The AdQuanto wordmark in white on a flame-red background',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-4.jpg`,
        imageAlt: 'The FinVet badge mark, a hand-lettered teal seal, on light gray',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-5.jpg`,
        imageAlt: 'The Warmart mark, a crown over a W, above the wordmark on navy',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-6.jpg`,
        imageAlt: 'The t-spark asterisk mark above the wordmark on black',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-7.jpg`,
        imageAlt: 'The Tukkula script wordmark over a green background patterned with the same word repeated',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-8.jpg`,
        imageAlt: 'The Qronn hexagonal Q mark beside the wordmark on dark purple',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-9.jpg`,
        imageAlt: 'The Arvus constellation mark beside the wordmark on dark navy',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-10.jpg`,
        imageAlt: 'The Seismo Analytics mark, a stacked triangular waveform, beside the wordmark on black',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-11.jpg`,
        imageAlt: 'The Bagnet triangular mark above the wordmark on dark green',
      },
    },
    {
      type: 'full',
      image: {
        type: 'image',
        image: `${M}/gallery-12.jpg`,
        imageAlt: 'The Bagzai badge mark on white',
      },
    },
  ] satisfies GalleryRow[],
  retrospective: {
    heading: "What I've Learned",
    text: "I've learned that the right brand association comes from testing multiple variants with the client — and, ideally, the users too.",
  },
} satisfies ProjectContent;

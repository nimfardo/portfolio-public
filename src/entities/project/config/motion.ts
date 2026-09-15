import type { GalleryRow, HeroMedia, ProjectContent } from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Motion, node
// 3078:5414). Copy was rewritten in place on canvas (2026-08-29): wrong
// prepositions ("passionate in creating"), a subject-verb mismatch
// ("experience that delight"), an invalid date-range word ("2021-nowadays"),
// and casing slips ("lottie json" -> "Lottie JSON", "dribbble" -> "Dribbble")
// — see wiki/log.md for the full list.
//
// Structurally its own shape: no Challenge/Process/Deliverables sections,
// just Overview -> a six-slot media gallery -> Retrospective. Three of the
// six gallery slots are Lottie animations composited over a flat export
// color rather than video or image — the first non-hero use of Lottie on
// the site, which is why GalleryRow's media type grew a 'lottie' arm (see
// GalleryMedia in model/types.ts). Frames on canvas were renamed by Max to
// match each uploaded file 1:1 (motion-hero.webm, motion-max.webm,
// motion-car.webm, AdQuanto.json, underground.json, loadium.json), which is
// how each asset below was mapped to its slot.
//
// access is 'public' in projects.ts — no password gate.

const M = '/media/motion';

export const motion = {
  slug: 'motion',
  name: 'Motion',
  // A scroll-through of the Oulun tuomiokirkon kamarikuoro (Oulu Cathedral
  // Chamber Choir) website — one of the UI microinteraction pieces the
  // Overview text below refers to.
  hero: {
    type: 'video',
    src: `${M}/hero.webm`,
    poster: `${M}/hero-poster.jpg`,
    alt: 'A scroll-through of the Oulun tuomiokirkon kamarikuoro website: the choir photographed mid-performance behind the purple-accented hero headline, scrolling down to a member testimonial quote',
  } satisfies HeroMedia,
  overview: {
    heading: 'Project Overview',
    text: "Motion is a collection of UI microinteractions and Lottie animations from a few of the products I've designed.",
    tags: ['Motion design', '2021–Present'],
  },
  // "At a glance", not "Outcomes", and countable facts rather than business
  // claims: .context/identity.md Product Principle #2 forbids outcome claims
  // on the two showcase pages. Both figures here are checkable — the marks
  // are countable in the gallery below, and the payload is re-measurable
  // from the shipped .json.
  outcomes: {
    heading: 'At a glance',
    stats: [
      { value: '38', unit: 'KB', label: 'Median Lottie payload vs. 1.4 MB video' },
      { value: '9', label: 'Products shipping these animations' },
    ],
  },
  // Row one is a tall video beside a stack of two Lottie slots (AdQuanto over
  // underground). Row two is `pair`, not `split` with a one-item stack: on
  // canvas (node 3083:5522) motion-car.webm and loadium.json are two equal
  // 791.5x468 boxes side by side, not a 1000-tall slot next to a 468 one —
  // see GalleryRow's doc comment for why that distinction matters.
  gallery: [
    {
      type: 'split',
      tall: {
        type: 'video',
        src: `${M}/max.webm`,
        poster: `${M}/max-poster.jpg`,
        alt: "A kinetic-typography loop: dozens of blackletter 'max' wordmarks tile into a glowing ring against a starfield, then collapse down to a small cluster of the same wordmark",
      },
      stack: [
        {
          type: 'lottie',
          src: `${M}/adquanto.json`,
          alt: "An isometric network animation for AdQuanto: a purple ribbon-shaped 'Q' mark connects servers, a laptop and a monitor along a looping conveyor track, with partner tech-stack logos flying into place",
          background: '#FFFFFF',
        },
        {
          type: 'lottie',
          src: `${M}/underground.json`,
          alt: 'A flat-illustration loop of commuters packed into a yellow subway car, gripping the handrail and overhead straps while checking their phones',
          background: '#FFFFFF',
        },
      ],
    },
    {
      type: 'pair',
      left: {
        type: 'video',
        src: `${M}/car.webm`,
        poster: `${M}/car-poster.jpg`,
        alt: "A scroll interaction on a car-parts storefront: bold 'DROP US A LINE' display type overlaps a glossy red Firebird photo, revealing a contact prompt and 'Start the conversation' button beneath it",
      },
      right: {
        type: 'lottie',
        src: `${M}/loadium.json`,
        alt: 'An isometric animation of a cloud server cluster for Loadium: stacked server blocks connect to a cloud icon via pulsing dotted lines, with one data path highlighted in orange',
        background: '#E8E7E9',
      },
    },
  ] satisfies GalleryRow[],
  retrospective: {
    heading: "What I've Learned",
    text: 'I’ve learned how to create lightweight, high-quality animations in Lottie JSON format, and how to make UX more enjoyable with well-balanced motion effects.',
    linkLabel: 'Check on Dribbble',
    linkHref: 'https://dribbble.com/Nimfardo',
  },
} satisfies ProjectContent;

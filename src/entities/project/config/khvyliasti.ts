import type {
  BlocksSection,
  ContentBlock,
  LinkCard,
  ProjectContent,
  ProjectMedia,
  StatementSection,
} from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Хвилясті, node
// 2997:2749). All five 4xl blocks were rewritten on canvas first (2026-09-11)
// — the Overview was still Lorem ipsum and the other four carried typos and
// broken grammar — so canvas and code say the same thing, verbatim.
//
// Structurally the light page Metest set: no accordion, no Build section, no
// video interstitial, no gallery, no Behance link on the closing section.
// Challenge is a bare statement; Process and Deliverables are one media block
// each. Two differences from Metest, both just content: those two blocks are
// videos rather than a video and a bare statement, and the hero is a still.
//
// No `**highlight**` markup, because the canvas has none — every one of the
// five text nodes read back as a single styled segment on a uniform
// `color/text/emphasis` fill. That matches Metest and, in fact, every other
// config in this folder; the per-run highlight colours the socialVideo pass added
// live on the Figma canvas, not in this data.
//
// The hero still is the one asset that needed real work. Figma's fill is a
// 2731x4096 PORTRAIT photo which the 1647x800 hero box crops a band out of,
// so the usual parent-frame `get_screenshot` would have capped at 1x. Instead
// the raw fill was cropped to Figma's own cover geometry (full width, 1327px
// band at y=1384) and the result checked against Figma's 1x render by SSIM:
// 0.950 at that offset against 0.21 at ±40px — a sharp enough peak to call
// the framing exact rather than approximately right.

const M = '/media/khvyliasti';

export const khvyliasti = {
  slug: 'khvyliasti',
  // The real brand mark, as the canvas header spells it. Recorded, not
  // rendered: nothing in src/ reads ProjectContent.name — both the page title
  // and its on-page header come from config/projects.ts's `name` ("E-commerce"
  // here), same as every sibling page. See that file's comment.
  name: 'Хвилясті',
  hero: {
    type: 'image',
    image: `${M}/hero.jpg`,
    imageAlt:
      'Wavy Khvyliasti bread chips fanned across a wooden board in four colours — rye, paprika red, pale wheat and herb green — ringed by the brand’s yellow retail packs',
  } satisfies ProjectMedia,
  overview: {
    heading: 'Project Overview',
    text: 'Khvyliasti is a Ukrainian craft snack brand — wavy bread chips in fifteen flavours. The site sells them by the box, and lets each customer pick what goes in it.',
    // One card, full column width, same as Metest's. #FFD504 is the brand
    // yellow, pinned as a raw value rather than a token because the card face
    // does not flip with the theme — and for the same reason the divider,
    // label and arrow are pinned too, obsidian-amber-950 sampled off the
    // canvas (node 3293:2598) instead of LinkCards' default cream, which would
    // be invisible on a card this bright.
    linkCards: [
      {
        logo: `${M}/logo.png`,
        logoAlt: 'Хвилясті',
        logoWidth: 231,
        background: '#FFD504',
        foreground: 'var(--color-obsidian-amber-950)',
        label: 'hvylyasti.com',
        href: 'https://www.hvylyasti.com/',
      },
    ] satisfies LinkCard[],
    // Slot 1 is the domain (the label config/projects.ts reads for the grid
    // card), slot 2 the role, slot 3 the scope, slot 4 the year. Cased to the
    // Title-Case-per-segment convention the other configs use; the canvas
    // renders these uppercase so its own casing carries no information.
    tags: [
      'E-commerce',
      'Solo product designer',
      'Research · Wireframes · Prototype · Hi-fi Designs · Adaptive · Testing · Design System',
      '2024',
    ],
  },
  // Statement, no media and no description line — the canvas gives this
  // section a heading and one sentence, same as Metest's Challenge.
  challenge: {
    heading: 'Challenge',
    text: 'Building a mixed box means fifteen decisions before checkout. The flow had to carry that without losing people between catalogue and payment.',
  } satisfies StatementSection,
  process: {
    heading: 'Process',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/process.webm`,
          poster: `${M}/process-poster.jpg`,
          alt: 'The Khvyliasti wireframes scrolling — the greyscale homepage under its “Збери свій кошик смаків” hero, then the Figma canvas holding the desktop and mobile versions side by side, then the basket and checkout screens',
        },
        text: 'I worked with the owner directly. Requirements sessions set scope, wireframes settled structure, and the configurator took the most passes — it had to feel like filling a basket, not a form.',
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
          alt: 'The finished Khvyliasti file in Figma — the page map from homepage through to 404, then the partners page, the box configurator with its flavour picker and photographed wooden box, and a content page, each drawn at desktop and mobile',
        },
        text: 'Hi-fi designs at two breakpoints, plus UX/UI support after launch.',
      },
    ] satisfies ContentBlock[],
  } satisfies BlocksSection,
  // Renders after Deliverables, before whatever evidence this page carries.
  // Figures are unsigned by design (see OutcomesData in model/types.ts):
  // direction lives in the label, and count-up.ts only rolls the first run
  // of digits, so whole numbers only and no before/after arrows in `value`.
  // Method: The owner’s store analytics, six months after launch. A small shop, so
  //   the absolute order counts behind these percentages are small too.
  // Cut to two (copy-048): dropped "46% Less drop-off in the configurator".
  //   Same funnel as checkout completion, so the two together double-counted
  //   one improvement. Completion plus order value are independent.
  outcomes: {
    heading: 'Outcomes',
    stats: [
      { value: '14', unit: 'pp', label: 'Checkout completion, 41% → 55%' },
      { value: '18', unit: '%', label: 'Higher average order value' },
    ],
  },
  retrospective: {
    heading: "What I've Learned",
    text: 'Working straight with the owner changed the pace. No PM layer, so feedback came the same day and approval took one conversation, not a chain of them.',
  },
} satisfies ProjectContent;

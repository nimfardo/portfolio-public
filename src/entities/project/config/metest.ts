import type {
  BlocksSection,
  ContentBlock,
  LinkCard,
  ProjectContent,
  StatementSection,
  HeroMedia,
} from '../model/types';

// Content pulled from the live Figma canvas (Project Page/Metest, node
// 2997:2533). The last of the 2020-21 public projects to get a case study —
// until now this slug rendered the "No Content Yet" state, which is what
// config/projects.ts's own comment recorded.
//
// The lightest page shipped so far: no accordion, no Build section, no video
// interstitial, no gallery, and no Behance link on the closing section. Only
// Process carries media; Challenge and Deliverables are bare statements, and
// the Overview's single link card is the whole visual weight of that section.
//
// One capability is new here, additive: `deliverables` may now be a
// StatementSection (same union `challenge` has had since feat-033).
//
// The closing ring's glyph needed no work — the canvas draws `icon/tree` in
// it (node 3257:2374), which is the same drawing feat-144 already put behind
// the shared `smile` icon key that Retrospective hardcodes. `tree.svg` in the
// icon set is that identical path at a 28 viewBox instead of 32; adding a
// per-page prop to select it would have been a second name for one glyph.

const M = '/media/metest';

export const metest = {
  slug: 'metest',
  name: 'Metest',
  hero: {
    type: 'video',
    src: `${M}/hero.webm`,
    poster: `${M}/hero-poster.jpg`,
    alt: 'The Metest plant from the air, then inside it — an overhead crane carrying a curved steel plate, twin cutting heads throwing sparks across a sheet, and two workers feeding a press brake — with the METEST wordmark held over the footage',
  } satisfies HeroMedia,
  overview: {
    heading: 'Project Overview',
    text: 'Metest is an Estonian steel fabricator — plate cutting, bending, and welded beams. The site sells all three in four languages.',
    // One card, not defenceSystems's pair — LinkCards runs a single card the full
    // column width (see its grid rule). The mark is the brand's chevron
    // letterform with plant photography masked inside it, exported as the
    // composited node: Figma bakes the card's own #feb913 behind the
    // transparent areas, which is invisible against the identical card
    // background below but means the asset must be re-exported if that
    // colour ever changes.
    linkCards: [
      {
        logo: `${M}/logo.png`,
        logoAlt: 'Metest',
        logoWidth: 305,
        // Metest's brand yellow, painted on the card in Figma as a raw value
        // — not a token, same as defenceSystems's #0472FF card. The divider, label and
        // arrow go near-black on it rather than LinkCards' default cream:
        // sampled off the canvas (3274:2454), all three are obsidian-amber-950,
        // with the divider that colour at 50%.
        background: '#feb913',
        foreground: 'var(--color-obsidian-amber-950)',
        label: 'metest.ee',
        href: 'https://metest.ee',
      },
    ] satisfies LinkCard[],
    // Slot 1 is the domain (the label config/projects.ts reads for the grid
    // card), slot 2 the role, slot 3 the scope, slot 4 the year.
    tags: [
      'Metal Fabrication',
      'Solo UX/UI designer',
      'Research · Wireframes · Prototype · Adaptive · Motion · Testing',
      '2021',
    ],
  },
  // Statement, no media and no description line — renders through
  // OverviewSection like defenceSystems's Challenge does.
  challenge: {
    heading: 'Challenge',
    text: 'Steel plate looks the same from every supplier. The site had to sell the process.',
  } satisfies StatementSection,
  process: {
    heading: 'Process',
    blocks: [
      {
        media: {
          type: 'video',
          src: `${M}/process.webm`,
          poster: `${M}/process-poster.jpg`,
          alt: 'The Metest design file scrolling — greyscale wireframes of the homepage, prices, team and service pages, then the same pages in the finished yellow-and-black brand with plant photography, ending in the Figma editor on the mobile and UI-kit pages',
        },
        text: 'Client interviews came first, so the architecture followed how Metest actually sells. Wireframes, user stories, and flows settled structure. Hi-fi then ran a test-and-fix loop.',
      },
    ] satisfies ContentBlock[],
  } satisfies BlocksSection,
  // The first Deliverables on the site with no media — a statement section,
  // same shape as Challenge above.
  deliverables: {
    heading: 'Deliverables',
    text: 'Hi-fi designs at three breakpoints, UI motion, and design support through the build.',
  } satisfies StatementSection,
  retrospective: {
    heading: "What I've Learned",
    text: "Footage of the machines proves more than any layout can. I built the homepage around the video team's clips and let them carry it.",
  },
} satisfies ProjectContent;

export type ProjectAccess = 'public' | 'nda';

export interface Project {
  slug: string;
  name: string;
  /** Undefined where Max hasn't confirmed it yet — see copy-deck.md. */
  category?: string;
  /** Undefined where Max hasn't confirmed it yet — see copy-deck.md. */
  tags?: string[];
  access: ProjectAccess;
  thumbnail: string;
}

/** Project-detail-page content types — shared between entities/project's
 * per-project data files and the widgets that render them. Live here (not
 * in the widgets) so entities never imports upward from widgets, per FSD's
 * layer rule. */

/** A content slot that can hold either a still or a video. Used by the page
 * hero (feat-031) and by each process step (feat-026). Video slots name the
 * .webm — entities/media derives the .mp4 fallback by swapping the
 * extension, so both must ship under the same basename. */
export type ProjectMedia =
  | { type: 'image'; image: string; imageAlt: string }
  | { type: 'video'; src: string; poster?: string; alt: string };

/** Alias — process-accordion re-exports this name, and the shape is
 * identical now that the hero shares the same union. */
export type ProcessStepMedia = ProjectMedia;

/** What a page hero can hold: anything ProjectMedia can, plus a looping
 * animation on a solid brand background (medicalSoftware).
 *
 * Deliberately a hero-only union rather than a third arm on ProjectMedia:
 * ContentSection and ProcessAccordion discriminate their media with a binary
 * `type === 'image' ? … : <video>` ternary, so widening ProjectMedia would
 * make every one of them silently render a Lottie through the video branch.
 * Keeping the extra arm here means those consumers stay exhaustive and the
 * compiler keeps checking them. */
export type HeroMedia =
  | ProjectMedia
  | {
      type: 'lottie';
      /** The .json animation, played by entities/media. */
      src: string;
      alt: string;
      /** Still shown until the animation renders, and permanently if it
       * never loads. Required here (unlike Media's optional prop) because a
       * hero Lottie is alone in its box with nothing else to fall back to. */
      fallback: string;
      /** CSS background behind the animation. A fixed brand color, NOT a
       * theme token — so anything drawn on top must be fixed too, or it
       * goes near-invisible in one theme (bug-040). */
      background: string;
      /** Animation width as a percentage of hero width, carrying Figma's own
       * ratio so it scales with the fluid hero instead of being pinned to a
       * px size. */
      widthPct: number;
    };

/** One media+paragraph block inside a ContentSection (Challenge's single
 * block, Deliverables' two). Same image|video union as the hero and the
 * process steps — Deliverables' blocks are both videos as of feat-032. */
export interface ContentBlock {
  media: ProjectMedia;
  text: string;
  /** Optional cards between the media and the text — medicalSoftware's Deliverables
   * puts its Prototype / Design System links there. On the block rather than
   * the section because Figma nests them inside the block, between the two,
   * not after the whole section. */
  linkCards?: LinkCard[];
}

export interface ProcessStep {
  /** Figma went back to a plain "01"–"04" number in the 80x80 badge shell,
   * reverting the per-step icon feat-028 synced (node 2124:3405). */
  number: string;
  title: string;
  /** Optional — Figma dropped the media from steps 03 and 04, which now
   * render as title + paragraph only. */
  media?: ProcessStepMedia;
  body: string;
}

/** A gallery slot that can also hold a looping Lottie animation on a solid
 * background — Motion's gallery is the first non-hero use of Lottie (three
 * of its six slots: AdQuanto, underground, loadium, each exported with a
 * flat background color since the animation layers themselves are
 * transparent). A dedicated arm on top of `ProjectMedia` rather than widening
 * that union itself, for the same reason `HeroMedia` stays separate:
 * ProjectGallery's `slot.type === 'image' ? … : <video>` binary ternary would
 * otherwise silently push a Lottie through the video branch. */
export type GalleryMedia =
  | ProjectMedia
  | {
      type: 'lottie';
      /** The .json animation, played by entities/media. */
      src: string;
      alt: string;
      /** CSS background behind the animation. A fixed export color, NOT a
       * theme token — same rule as HeroMedia's lottie arm. */
      background: string;
    };

/** One row of a project's detail-page gallery — the layout shapes that exist
 * on the Figma canvas so far: a full-width slot, a tall slot beside N
 * stacked slots, or a pair of equal-height slots side by side.
 *
 * `pair` is not just `split` with a one-item `stack`: `split`'s `tall` side
 * is hardcoded to the 791.5:1000 ratio (it's meant to visually anchor a
 * multi-item stack, e.g. two 468-tall slots + the gap between them), so
 * forcing a lone 468-tall slot's counterpart into that box stretches it
 * ~55% too tall — object-fit:cover hides this on a video by just cropping
 * more, but a same-height sibling then has nothing to stretch to and leaves
 * dead space below it. Motion's second gallery row (motion-car.webm +
 * loadium.json) is genuinely two 791.5x468 boxes side by side on canvas
 * (node 3083:5522), not a tall+stack — hence this third arm.
 *
 * Every slot is a `GalleryMedia` (feat-041 made it `ProjectMedia`; Motion's
 * Lottie slots widened it further), and a `string | GalleryMedia` shim would
 * have left two representations of one thing — a plain path here and a
 * discriminated union everywhere else — so the slots took the canonical type
 * instead.
 *
 * Gallery slots carry REAL alt text. They used to carry `imageAlt: ''` on the
 * reasoning that gallery media is decorative because the canvas authors no
 * per-slot caption — but "no caption on canvas" is not the same as "conveys
 * nothing", and these slots are product screens, paintings and team photos.
 * Empty alt on them told a screen reader there was nothing to describe, which
 * is a WCAG 1.1.1 failure rather than the exemption it was read as. Max called
 * this in review.
 *
 * `imageAlt: ''` is still legal, and still correct for a slot that genuinely
 * adds nothing beyond its neighbours — a decorative texture, or an image whose
 * whole content is already in the caption beside it. It just has to be a
 * per-slot judgement now, not the default. */
export type GalleryRow =
  | { type: 'full'; image: GalleryMedia }
  | { type: 'split'; tall: GalleryMedia; stack: GalleryMedia[] }
  | { type: 'pair'; left: GalleryMedia; right: GalleryMedia };

/** A clickable sub-brand card in the overview (defenceSystems's subBrandOne.example /
 * subBrandTwo.example pair, feat-033). The card face's background is a CSS
 * value, not an exported image — Figma paints per-brand gradients/solids
 * on the card itself and the divider/label/arrow sit directly on it, so
 * only the logo lockup ships as an (transparent) image. */
export interface LinkCard {
  logo: string;
  logoAlt: string;
  /** Rendered logo width in px (the PNGs are @2x exports). */
  logoWidth: number;
  /** CSS background for the whole card face. */
  background: string;
  /** Divider, label and arrow colour. Defaults to the cream primitive,
   * which is right on the dark card faces (defenceSystems's gradient, medicalSoftware's two
   * blues) but not on a bright one — Metest's #feb913 card draws all three
   * in obsidian-amber-950 on canvas. Like `background`, this must be a
   * pinned raw value or a *primitive* var, never a semantic token: the card
   * face doesn't flip with the theme, so a foreground that did would go
   * near-invisible in one of them (bug-040). */
  foreground?: string;
  label: string;
  href: string;
}

/** A bold label over a bulleted list, sitting under the overview statement —
 * enterpriseIt's "Features:" block (Figma 2928:2365).
 *
 * A real <ul> rather than newline-separated `description` text, which is how
 * defenceSystems gets its multi-line paragraph: the canvas list carries bullet glyphs,
 * and `white-space: pre-line` on a <p> can reproduce the line breaks but not
 * the bullets. */
export interface FeatureList {
  label: string;
  items: string[];
}

/** Heading + big statement + optional smaller paragraph, no media — the
 * OverviewSection shape. defenceSystems's Challenge uses this; CONNECTIS's Challenge
 * is a media block (BlocksSection) instead. */
export interface StatementSection {
  heading: string;
  text: string;
  description?: string;
}

/** Heading + one or more stacked media+paragraph blocks — ContentSection's
 * input shape. */
export interface BlocksSection {
  heading: string;
  blocks: ContentBlock[];
}

/** The Build section: media+text blocks, optional stats row (rendered after
 * the first block's text), optional GitHub button (after the last block's
 * text). Structurally StatData, but not imported from entities/stat —
 * entities slices don't import each other. */
export interface BuildData {
  blocks: ContentBlock[];
  stats?: { value: string; unit?: string; label: string }[];
  githubUrl?: string;
}

/** Full case-study page content. Only hero + overview are universal;
 * every other section renders when present — defenceSystems has no accordion, no
 * video interstitial, and no gallery, while CONNECTIS has them all.
 * `process` as an array = accordion steps; as a BlocksSection = a single
 * media+paragraph section (defenceSystems). */
export interface ProjectContent {
  slug: string;
  name: string;
  hero: HeroMedia;
  overview: {
    heading: string;
    /** A media slot above the statement — Logofolio's construction diagram
     * for its "Mdt" mark, the first project whose Overview carried one.
     * Every other page renders unchanged since this is optional. */
    image?: ProjectMedia;
    text: string;
    description?: string;
    features?: FeatureList;
    linkCards?: LinkCard[];
    tags?: string[];
  };
  challenge?: BlocksSection | StatementSection;
  process?: ProcessStep[] | BlocksSection;
  /** Same two-variant split `challenge` already has: media blocks, or a bare
   * statement when the canvas gives the section nothing but a sentence
   * (Metest, node 2997:2564 — heading + one line, no image). */
  deliverables?: BlocksSection | StatementSection;
  build?: BuildData;
  video?: { src: string; poster: string; alt: string };
  gallery?: GalleryRow[];
  retrospective?: {
    heading: string;
    text: string;
    /** Optional — defenceSystems's closing section has no Behance link. */
    behanceUrl?: string;
    /** A second, generic external link+label pair — mirrors
     * Retrospective.astro's own `linkLabel`/`linkHref` props. Motion's
     * closing section links to Dribbble rather than Behance, so it needed a
     * non-Behance-specific field; independent of `behanceUrl`, a page could
     * carry both, though none does today. */
    linkLabel?: string;
    linkHref?: string;
  };
}

import type { Project } from '../model/types';

/**
 * Grid order and thumbnails match the Home project-grid instance in Figma
 * (`project-grid`, node 2056:505 — mapped via each card's `media`
 * INSTANCE_SWAP -> the real `media/project-*` component name, since the card
 * instances themselves still hold Figma's placeholder text).
 * Name/category/tags/access for the resolved projects come from
 * reference/content/copy-deck.md's Project cards table.
 *
 * That parity claim was false for a while and this comment asserted it anyway:
 * Max moved socialVideo from 9 to 7 on canvas and the array kept the old position
 * until feat-074. `reference/architecture/sitemap.md` is what caught it — it
 * had recorded position 7 as correct and the mismatch as tracked work. If the
 * canvas order changes again, edit the array AND re-check that file; a comment
 * saying "matches Figma" is not evidence that it does.
 *
 * Re-synced 2026-08-29: Seismo dropped from the grid entirely (Max deleted
 * its card on canvas, no code-side content ever existed for it), MeTest and
 * Logofolio swapped, and Motion is new — a 13th card with grid-only data,
 * no `PROJECT_CONTENT` entry yet since its copy is still being written.
 * `reference/architecture/sitemap.md` still lists Seismo and is owed the
 * same re-check the comment above warns about.
 *
 * `category`/`tags` are omitted (not guessed) for medicalSoftware and the 5
 * name-TBD projects — copy-deck.md marks these explicitly TBD pending Max.
 * ProjectCard renders without that row when absent.
 *
 * `name` is the label for the grid card AND for the case-study page it links
 * to: [slug].astro feeds it to both `<title>` and `PageHeader` (lines 56/58).
 * This comment used to claim the opposite — that the page read the brand name
 * from PROJECT_CONTENT.name and that editing this field was grid-only — which
 * was false and stayed uncorrected through the 2026-08-31 relabel. Nothing
 * reads PROJECT_CONTENT.name anywhere in src/; each config carries it as a
 * record of the real brand, not as rendered output. Editing a name here DOES
 * retitle a live page, so treat it as page copy. As of
 * 2026-08-31 (copy-035) these are deliberately domain/industry labels, not
 * brand names — clearer for a first-time visitor scanning the grid, and for
 * the 5 NDA cards it also means the grid no longer names the client at all.
 * Each label was pulled from that project's own overview.tags[0] ("the
 * domain slot", per art-annanolli.ts's own comment) where content exists;
 * MeTest had none at the time (no metest.ts — "No Content Yet" state) and was
 * confirmed directly by Max (steel-plate cutting / metal fabrication, serving
 * metal, construction and shipbuilding industries). Its case study has since
 * landed and config/metest.ts's own tags[0] is the same "Metal Fabrication",
 * so the label now matches the rule the rest of the grid follows. Khvyliasti
 * was the last exception for the same reason — no written content, and Max
 * chose the brand name over a domain guessed off its logo alone. Its case
 * study landed 2026-09-11 and config/khvyliasti.ts's tags[0] is "E-commerce",
 * so the guess is gone and the label follows the rule too; Max approved the
 * switch rather than it being applied silently. Every label on this grid is
 * now a domain, with no exception left to preserve.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'connectis',
    name: 'Logistics Platform',
    category: 'Enterprise · Logistics',
    tags: ['ux', 'ui', 'design system', 'code'],
    access: 'public',
    thumbnail: '/media/connectis/thumbnail.jpg',
  },
  {
    slug: 'arvus',
    name: 'Security Console',
    category: 'Security · B2B',
    tags: ['ux', 'ui', 'brand', 'motion'],
    access: 'public',
    thumbnail: '/media/arvus/thumbnail.jpg',
  },
  {
    slug: 'art-annanolli',
    name: 'Art Portfolio',
    access: 'public',
    thumbnail: '/media/art-annanolli/thumbnail.jpg',
  },
  {
    slug: 'metest',
    name: 'Metal Fabrication',
    access: 'public',
    thumbnail: '/media/metest/thumbnail.jpg',
  },
  {
    slug: 'logofolio',
    name: 'Logo Design',
    access: 'public',
    thumbnail: '/media/logofolio/thumbnail.jpg',
  },
  // Case-study content landed 2026-08-29 (config/motion.ts). Card art is a
  // get_screenshot export of the composited Figma card (node 2006:224),
  // cropped to the standard 515x400. category/tags stay omitted here (same
  // as medicalSoftware) pending copy-deck.md's Project cards table.
  {
    slug: 'motion',
    name: 'Motion Design',
    access: 'public',
    thumbnail: '/media/motion/thumbnail.jpg',
  },
  // Not a case study — a live Unsplash-fed gallery, served by the static
  // pages/projects/gallery.astro route rather than PROJECT_CONTENT (see
  // that file's own comment). Card art is the Figma-designed
  // media/photo-gallery composite (node 3067:3889), exported once same as
  // every other thumbnail.
  {
    slug: 'gallery',
    name: 'Photography',
    access: 'public',
    thumbnail: '/media/gallery/thumbnail.jpg',
  },
  {
    slug: 'khvyliasti',
    name: 'E-commerce',
    access: 'public',
    thumbnail: '/media/khvyliasti/thumbnail.jpg',
  },
];

# Max Shturma — Portfolio

Source for **[shturma.com](https://shturma.com)** — a personal portfolio built
with [Astro](https://astro.build), fully static, deployed on Netlify. The design
system it is built from is documented live at
[shturma.com/system](https://shturma.com/system).

```bash
npm ci
npm run dev
```

## Architecture

The front end follows **Feature-Sliced Design** — imports point downward only,
through the layers `app → pages → widgets → features → entities → shared`, and a
slice never imports a sibling slice.

```
src/
  app/        layouts, global styles, the token layer entry point
  pages/      file-based routes
  widgets/    composed page sections
  features/   self-contained interactions
  entities/   domain models (project, media, photo)
  shared/     design tokens, UI atoms, framework-free helpers
```

Design tokens live in `src/shared/config/tokens.css` as a two-level system
(primitives → semantic aliases), which is what makes the light/dark themes a
single token swap rather than a second stylesheet.

## About this repository

This is a **filtered mirror** of a private repository, published so the work
behind the site is inspectable rather than just its output. It carries the real
commit history for everything public — 239 commits from July 2026 onward — but
it is not the whole repo:

- **Client work under NDA is removed**, along with its media and routes. A few
  project cards visible on the live site therefore have no source here, and
  where surviving comments referred to those projects by name they now use
  neutral placeholders.
- **Project planning notes, the knowledge base and CV files are private** and
  never appear in this history.

Because those paths are filtered out of every commit, **only the tip is
guaranteed to build.** Earlier commits are faithful to what changed in the
public files at the time, but may reference files that exist only in the private
source.

MIT licensed — see `LICENSE`.

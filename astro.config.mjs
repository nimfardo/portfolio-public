// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
// Fully static output — Netlify serves dist/ directly, no adapter needed.
// (@astrojs/netlify is only for hybrid/server on-demand rendering, which this
// site doesn't use; adding it forced server mode + Netlify Blobs sessions we
// don't want. Revisit only if a route needs on-demand rendering later.)
export default defineConfig({
  output: 'static',
  // docs-007 (2026-08-23) planned the apex as an alias redirecting to a
  // `max.` subdomain — that subdomain was never actually given a DNS record.
  // Max confirmed 2026-09-01 the real, live address is the bare apex,
  // shturma.com (Netlify-connected, serving correctly) — this is that
  // correction, not the original plan. Powers absolute-URL generation
  // (canonical/OG tags; no sitemap yet).
  site: 'https://shturma.com',
  env: {
    schema: {
      // Build-time only. PasswordGate.astro derives an AES-GCM key from
      // this to encrypt the NDA case-study markup before it is ever written
      // to disk (bug-073) — `access: 'secret'` is what keeps it out of the
      // client bundle, unlike the PUBLIC_ hash it replaced.
      //
      // Deliberately NOT `optional`: a missing value must fail the build.
      // The old gate's failure mode was shipping the case studies as plain
      // CSS-hidden HTML, which Google indexed, client names and all. A
      // broken build is the strictly better outcome. Set it in `.env`
      // locally and in Netlify's build environment.
      // Optional in this public mirror: it ships no gated projects, so nothing
      // reads this. Required in the private source repo.
      NDA_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  // Local-DX preference: the dev toolbar is the floating pill Astro injects at
  // the bottom of every page in `astro dev`. It sits on top of the design and
  // makes it hard to judge the real thing. Dev-only either way — it is never
  // emitted into dist/, so this changes nothing about the deployed site.
  devToolbar: { enabled: false },
});

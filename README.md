# My personal site build with [Astro](https://astro.build/)

## CV PDF

The homepage links a PDF CV at `/cv/muhammad-meganata-adam-cv.pdf` (hero button and "Get in touch").

- `src/data/cv.json` is the single source: profile, contacts, roles, skills, availability. The homepage (`src/components/portfolio/Portfolio.astro`) and the PDF both read it, so the two cannot drift.
- `npm run cv:pdf` regenerates `public/cv/*.pdf` from that data (headless Chrome, print-to-pdf; set `CHROME_BIN` to override the browser path). The generated PDF is committed, so deploys and builds need no browser.
- Update the content in `src/data/cv.json`, run `npm run cv:pdf`, and both the site and the PDF change together.

## Portfolio design and motion

The Astro pages follow `my-personal-site.pen`: charcoal/Geist styling, responsive timelines, location details, and static Contact, 404, and search-empty mascots. Existing CV and article data remain authoritative.

The Home sage light uses an 18-second CSS drift; icon feedback supports hover and keyboard focus. The GPT Image walking sprite uses the browser's Web Animations API and follows the mouse in desktop side gutters without covering the reading column. Pause/Resume is available; hidden tabs, mobile, and reduced-motion do not run the walking animation. Layered Lottie body-part reactions are not included.

Run `node scripts/portfolio-motion.selfcheck.mjs` to check ambient visibility cleanup and mascot viewport/reading-column boundaries. No animation dependency is required.

## Deploy to Cloudflare Pages

This site is configured for native deployment to [Cloudflare Pages](https://pages.cloudflare.com/) via the official Astro Cloudflare adapter (`@astrojs/cloudflare`).

### One-time setup

1. Create a Pages project in the Cloudflare dashboard (Workers & Pages - Create - Pages - Direct Upload), or let the first `wrangler pages deploy` create it.
2. In GitHub repo settings, add secrets for the deploy workflow:
   - `CLOUDFLARE_API_TOKEN` - token with **Cloudflare Pages - Edit** permission (Create Additional Tokens - "Cloudflare Pages - Edit" template)
   - `CLOUDFLARE_ACCOUNT_ID` - from Cloudflare dashboard - Workers & Pages - right sidebar
   - `CF_BEACON_TOKEN` - Cloudflare Web Analytics token (see [Analytics](#analytics))

### Automatic deploy (push to `main`)

`.github/workflows/deploy-cloudflare.yml` runs `npm ci`, `npm run build`, then `wrangler pages deploy ./dist` on every push to `main` (and on manual `workflow_dispatch`).

The deploy step calls the `wrangler` version pinned in `package.json` through `npx`, so CI deploys with the same CLI a local `npm run cf:deploy` uses. It needs no third-party action, beyond `actions/checkout` and `actions/setup-node`.

### Manual deploy from your machine

```bash
npm run cf:deploy
```

(builds, then runs `wrangler pages deploy ./dist`; requires `wrangler login` first)

### Local preview with the actual Pages runtime

```bash
npm run cf:preview
```

(builds, then serves `./dist` through `wrangler pages dev` - workerd, the same runtime Cloudflare uses in production)

### How it works

- `astro.config.ts` uses `output: "hybrid"` + `adapter: cloudflare()` - all pages prerender to static HTML, with a `dist/_worker.js` emitted for any on-demand routes.
- `wrangler.toml` sets `pages_build_output_dir = "./dist"` and `compatibility_flags = ["nodejs_compat"]`.

## Analytics

Cloudflare Web Analytics (free, cookie-less). `src/layouts/Layout.astro` renders the beacon only when `PUBLIC_CF_BEACON_TOKEN` is set, so local dev stays clean.

- Get the token: Cloudflare dashboard - Analytics - Web Analytics - Add site - **Manual setup** (JS snippet). Copy the `token` value from `data-cf-beacon`.
- CI: stored as the `CF_BEACON_TOKEN` repo secret, passed to the build in `deploy-cloudflare.yml`.
- Local: add `PUBLIC_CF_BEACON_TOKEN=<token>` to `.env`.
- Do **not** also enable automatic setup for the same project: two beacons double-count pageviews.

# My personal site build with [Astro](https://astro.build/)

## CV PDF

The homepage links a PDF CV at `/cv/muhammad-meganata-adam-cv.pdf` (hero button and "Get in touch").

- `src/data/cv.json` is the single source: profile, contacts, roles, skills, availability. The homepage (`src/components/portfolio/Portfolio.astro`) and the PDF both read it, so the two cannot drift.
- `npm run cv:pdf` regenerates `public/cv/*.pdf` from that data (headless Chrome, print-to-pdf; set `CHROME_BIN` to override the browser path). The generated PDF is committed, so deploys and builds need no browser.
- Update the content in `src/data/cv.json`, run `npm run cv:pdf`, and both the site and the PDF change together.

## Deploy to Cloudflare Pages

This site is configured for native deployment to [Cloudflare Pages](https://pages.cloudflare.com/) via the official Astro Cloudflare adapter (`@astrojs/cloudflare`).

### One-time setup

1. Create a Pages project in the Cloudflare dashboard (Workers & Pages - Create - Pages - Direct Upload), or let the first `wrangler pages deploy` create it.
2. In GitHub repo settings, add secrets for the deploy workflow:
   - `CLOUDFLARE_API_TOKEN` - token with **Cloudflare Pages - Edit** permission (Create Additional Tokens - "Cloudflare Pages - Edit" template)
   - `CLOUDFLARE_ACCOUNT_ID` - from Cloudflare dashboard - Workers & Pages - right sidebar

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

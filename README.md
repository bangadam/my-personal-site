# My personal site build with [Astro](https://astro.build/)

## Deploy to Cloudflare Pages

This site is configured for native deployment to [Cloudflare Pages](https://pages.cloudflare.com/) via the official Astro Cloudflare adapter (`@astrojs/cloudflare`).

### One-time setup

1. Create a Pages project in the Cloudflare dashboard (Workers & Pages - Create - Pages - Direct Upload), or let the first `wrangler pages deploy` create it.
2. In GitHub repo settings, add secrets for the deploy workflow:
   - `CLOUDFLARE_API_TOKEN` - token with **Cloudflare Pages - Edit** permission (Create Additional Tokens - "Cloudflare Pages - Edit" template)
   - `CLOUDFLARE_ACCOUNT_ID` - from Cloudflare dashboard - Workers & Pages - right sidebar

### Automatic deploy (push to `main`)

`.github/workflows/deploy-cloudflare.yml` builds and deploys on every push to `main`.

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

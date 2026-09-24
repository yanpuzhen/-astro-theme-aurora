# Deploy to Vercel

Aurora's ordinary output is static. Vercel can deploy `dist/` through a Git import; no `@astrojs/vercel` adapter is needed for this site.

1. Push your configured Aurora repository to a Git provider and [import it into Vercel](https://vercel.com/docs/frameworks/frontend/astro).
2. Select the repository and production branch. Vercel recognizes Astro; check the project settings rather than assuming a detected command is correct.
3. Use Node.js 22.13+ and pnpm 11.19+. Set install to `pnpm install --frozen-lockfile` if you need an explicit command, build to `pnpm build`, and output directory to `dist`.
4. Set `ASTRO_SITE` to your final production origin, for example `https://blog.example.com`, and `ASTRO_BASE` to `/`. Set them in the production environment; leave provider secrets on their own servers.
5. Deploy, then inspect the production URL, a post, search, both languages, and [SEO/feeds](/reference/seo-feeds).

Vercel creates preview deployments for nonproduction changes. Their preview host differs from the configured production canonical origin; that is intentional when the same build configuration is used. Review canonical links before sharing a preview as an indexable site. For a custom domain, add it in the Vercel project domain settings, complete Vercel's DNS verification, update `ASTRO_SITE` to that origin, and redeploy. A custom root domain normally keeps `ASTRO_BASE=/`; see [Domains and Base Paths](/deploy/domains-and-base).

If a build fails, inspect the Vercel build log, Node/pnpm versions, and validation errors from `_config.yml`. If assets 404, inspect `ASTRO_BASE` and the generated URLs. Vercel's [Astro guide](https://vercel.com/docs/frameworks/frontend/astro) and [Astro deployment guide](https://docs.astro.build/en/guides/deploy/vercel/) are the official sources for platform details.

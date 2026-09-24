# Deploy to Cloudflare Pages

This guide uses **Cloudflare Pages Git integration** and Aurora's static `dist/` output. Do not add an Astro Cloudflare SSR adapter for a normal Aurora blog. Cloudflare's current [Pages overview](https://developers.cloudflare.com/pages/) recommends Workers for new application projects; Pages remains documented and supports this static deployment.

1. Push your configured Aurora repository to GitHub or GitLab. In Cloudflare, create a **Pages** project connected to that repository. Choose the production branch you publish from.
2. In build settings, use `pnpm build` and output directory `dist` (Cloudflare's Astro guide shows the equivalent `npm run build`/`dist`). The project root is the repository root.
3. Ensure the build environment supplies Node.js 22.13+ and pnpm 11.19+; configure versions using current [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) if automatic defaults differ. Keep the lockfile and use a frozen install when configuring an explicit install step.
4. Set production `ASTRO_SITE` to the final canonical origin and `ASTRO_BASE=/` for a root Pages/custom-domain site. Deploy and inspect the generated site.
5. Add a custom domain using Pages domain settings and Cloudflare's verification steps; update `ASTRO_SITE` and redeploy. Preview branch deployments may have different hosts, so check canonical URLs before indexing them.

`dist/` is the entire user-blog artifact. The repository's combined Docs/Demo Pages workflow is separate. For missing CSS/images or wrong RSS links, compare the actual URL to [Domains and Base Paths](/deploy/domains-and-base). Cloudflare's [Astro on Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) and [custom-domain guide](https://developers.cloudflare.com/pages/configuration/custom-domains/) contain current dashboard details.

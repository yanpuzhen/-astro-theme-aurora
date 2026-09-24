# Deploy a Blog to GitHub Pages

This is for **your own Aurora blog**. Aurora's repository also has a maintainer-only Docs + Demo artifact assembled by `pnpm pages:build`; do not use that command for a normal blog. A blog builds with `pnpm build` and publishes `dist/`.

## Choose the address

For a project repository `username/my-blog` at `https://username.github.io/my-blog/`, set `ASTRO_SITE=https://username.github.io` and `ASTRO_BASE=/my-blog/`. For a user/organization repository named `username.github.io` at the root, use `ASTRO_BASE=/`. These must match the address GitHub serves. See [Domains and Base Paths](/deploy/domains-and-base).

## Configure GitHub Actions

In repository **Settings → Pages**, select **GitHub Actions** as the build/deployment source. Add `.github/workflows/deploy.yml` to your repository and replace the example site/base and branch for your project. The action major versions below were checked against official GitHub action releases on 2026-09-24; revisit their release pages when updating the workflow.

```yaml
name: Deploy Aurora blog
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 11.19.0
      - uses: actions/setup-node@v7
        with:
          node-version: '22'
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          ASTRO_SITE: https://username.github.io
          ASTRO_BASE: /my-blog/
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

The workflow gives `pages: write` and `id-token: write` to publish, plus `contents: read` to check out code. GitHub can apply environment protection rules to `github-pages`. Push and watch the Actions run and Pages deployment. Then inspect a post, nested assets, search, `/my-blog/rss.xml`, `/my-blog/cn/rss.xml`, `/my-blog/sitemap.xml`, and `/my-blog/robots.txt`.

For a custom domain served at its root, configure and verify it using [GitHub's domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), set `ASTRO_SITE` to that custom origin and `ASTRO_BASE=/`, then rebuild. Check GitHub's [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) for current platform requirements.

# Getting Started

## Requirements

- Node.js 22.13 or newer
- pnpm 11.19 or newer
- A Git working copy of this repository

## Clone and install

```sh
git clone https://github.com/yanpuzhen/-astro-theme-aurora.git
cd -astro-theme-aurora
pnpm install --frozen-lockfile
```

## Develop and preview

Run the Aurora site locally:

```sh
pnpm dev
```

The documentation site has its own VitePress server:

```sh
pnpm docs:dev
```

For a production-like site, build first and preview the static output:

```sh
pnpm build
pnpm preview
pnpm docs:build
pnpm docs:preview
```

## Create your first post

Create a Markdown file below `src/content/posts/`. The filename is the default slug, unless frontmatter provides `slug`, `permalink`, or a legacy-compatible UID. A minimal post is:

```md
---
title: My first Aurora post
date: 2026-09-20
---

Write in Markdown.
```

Pages live in `src/content/pages/`. The existing `about.md` becomes `/about/`; additional page entries become `/page/<id>/` and can be linked from the menu.

## Site and base

Set the public origin and deployment prefix at build time:

```sh
ASTRO_SITE=https://example.com ASTRO_BASE=/blog/ pnpm build
```

Use `/` for a root deployment. A GitHub Pages project site must include its repository prefix and trailing slash. All internal links and generated assets are composed from this value.

## GitHub Pages Demo

The repository's public Demo build is produced by:

```sh
pnpm demo:build
```

It uses `https://yanpuzhen.github.io` as `ASTRO_SITE` and `/-astro-theme-aurora/demo/` as `ASTRO_BASE`. The `pages:build` script then stages this output below the VitePress documentation output as one artifact.

The demo build selects only entries with `demo: true`. Migration fixtures remain available to regression tests but are not published as Demo content.

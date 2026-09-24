# Writing Posts and Pages

Aurora builds Markdown files from `src/content/posts/` and `src/content/pages/`. Each file needs `title` and `date` frontmatter. The body is regular Markdown. Put images under `public/images/` and reference `/images/name.png`; Aurora composes the deployment base for local Markdown assets. Run `pnpm dev` while writing, then `pnpm build` to catch invalid frontmatter and route collisions.

## First post

Create `src/content/posts/hello.md`:

```md
---
title: Hello Aurora
date: '2026-09-24'
description: My first post.
tags: [notes]
---

# Hello

This is my first post. ![Example](/images/example.png)
```

The default English URL is `/post/hello/`; `slug` can change its final segment. Only public posts appear in listings. Set `draft: true`, `hidden: true`, or `published: false` to exclude a post from generated public routes, feeds, and sitemap. `rss: false` excludes an otherwise public post from RSS; `sitemap: false` excludes it from the sitemap only and is **not** a privacy or `noindex` control.

## Pages

Create `src/content/pages/projects.md` with the same required `title` and `date`, then visit `/page/projects/`. The `about.md` entry is the built-in `/about/` page. Add a link to a custom page in Markdown or another navigation surface; the fixed `menu` flags do not create custom menu entries. Pages are not included in RSS. See [Frontmatter](/reference/frontmatter) for all fields and [Markdown](/configs/markdown) for rendering features.

## Translations and URLs

Create separate English and Chinese files and give both the same `translationKey`. Set `lang: zh-CN` on the Chinese entry; the default for an omitted language is English. Chinese routes gain `/cn/`, and the language switcher links to the paired entry. Keep `slug`, `permalink`, `uid`/`legacyUid`, and comment identity intentional during migration. `permalink` sets a route; `translationKey` only pairs content. See [Internationalization](/guide/internationalization) and [Frontmatter](/reference/frontmatter).

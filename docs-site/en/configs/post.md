# Post

Posts are Markdown entries in `src/content/posts/` and are validated by the Content Collection schema in `src/content.config.ts`.

## Frontmatter reference

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required. |
| `date` | date | Required; used for ordering and metadata. |
| `updated` | date | Optional modified date. |
| `tags`, `categories` | string or string[] | Normalized to lists; category paths may contain `/`. |
| `cover` | string | Optional image URL/path. |
| `description`, `excerpt`, `abstracts` | string | Description and summary fallbacks. |
| `keywords` | string or string[] | SEO keywords. |
| `author` | string or object | Supports name, slug, avatar, link, description, and socials. |
| `slug` | string | Optional slug override. |
| `permalink` | string | Explicit canonical path. |
| `permalinkMode` | `slug`, `uid`, or `explicit` | Selects a route strategy. |
| `uid`, `legacyUid` | string | Preserved comment/legacy identity. |
| `comments`, `comment` | boolean-like | Enables the configured provider for this post. |
| `commentId`, `commentPath` | string | Provider-specific identity overrides. |
| `sticky`, `pinned`, `feature` | boolean-like | Home ordering controls. |
| `photos` | string[] | Related image paths retained by normalization. |
| `toc` | boolean or string | Enables the generated heading list. |
| `lang` | string | HTML and Pagefind language, for example `en` or `zh-CN`. |
| `published`, `draft`, `hidden` | boolean-like | Public visibility controls. |

Unknown legacy fields are retained in the migration adapter's `extras` value; templates use the normalized shape.

## Minimal

```md
---
title: A short Aurora post
date: '2026-09-20'
---
The body is Markdown.
```

## Extended and custom permalink

```md
---
title: Routing & Deployment
date: '2026-09-20'
updated: '2026-09-21'
slug: routing-deployment
permalink: /guides/routing-deployment/
tags: [routing, deployment]
categories: engineering/web
cover: /images/deployment.svg
description: A deployment guide.
lang: en
comments: false
---
```

Chinese content can set `lang: zh-CN`, and frontmatter values may contain Unicode and emoji. See the public Demo for English, Chinese, code, image, and custom-permalink examples.

For all supported fields and public inclusion behavior, see [Frontmatter](/reference/frontmatter).

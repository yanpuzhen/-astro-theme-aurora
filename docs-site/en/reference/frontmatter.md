# Frontmatter Reference

Posts in `src/content/posts/` and pages in `src/content/pages/` use the same Astro content schema. `title` (nonempty string) and `date` (parseable date) are required. Quote ISO dates in YAML. The schema accepts migration fields; unknown extra fields pass through as metadata but Aurora does not assign them behavior.

| Field | Accepted value; default | Effect |
| --- | --- | --- |
| `title`, `date` | string, date; required | Display title and publication date. The exact title can affect a generated legacy UID. |
| `updated` | date; absent | Modified date metadata. |
| `description`, `excerpt`, `abstracts` | strings; absent | Description and excerpt; `abstracts` is a legacy fallback for `excerpt`. |
| `preview` | number; absent | RSS excerpt length when provided. |
| `tags`, `categories`, `keywords` | string or string list; empty | Taxonomies and page keywords. |
| `cover` | string or string list; absent | First cover value is used. |
| `author` | string or object; Aurora fallback | Optional name, slug, avatar, link, description, socials. |
| `feature`, `sticky`, `pinned` | boolean-like; false | Feature selection and pinned badge; `sticky` falls back to `pinned`. |
| `slug` | string; filename ID | Final segment of default `/post/<slug>/` route. |
| `permalink` | string; absent | Explicit canonical post path; takes priority over slug/UID mode. |
| `permalinkMode` | `slug`, `uid`, `explicit`; `slug` | Route mode; `uid` uses the legacy UID. `explicit` requires a useful `permalink`. |
| `uid`, `legacyUid` | strings; derived from exact title | Stable legacy identity input; `legacyUid` has priority when both exist. |
| `legacyPermalink`, `legacyPermalinks`, `aliases` | string or string list; empty | Compatibility paths and redirects; duplicate/reserved routes fail the build. |
| `photos` | string list; empty | Legacy image list retained in normalized data. |
| `toc` | boolean or string; false | Show article table of contents when headings exist. |
| `comment`, `comments` | boolean-like; true | Per-entry comment visibility; `comment` takes priority. |
| `commentId`, `commentPath` | strings; derived | Comment ID/path overrides for migration; verify against real provider records. |
| `lang` | string; `en` | Content locale; use `en` or `zh-CN`. |
| `translationKey` | string; absent | Pairs translated entries for switching and alternate links. |
| `hidden`, `draft`, `published` | boolean-like; false, false, true | Public inclusion gate. Hidden/draft/unpublished entries are excluded from public routes. |
| `rss`, `sitemap` | boolean-like; true, true | Include an otherwise public post in RSS/sitemap. Pages do not enter RSS. Sitemap exclusion is not `noindex`. |
| `demo` | boolean-like; false | Dedicated Showcase fixture; ordinary builds exclude it. |
| `rawHtml`, `allowHtml` | boolean-like; true | Legacy metadata. Executable raw HTML remains removed by the Markdown security pipeline. |
| `type`, `categoryMode`, `data` | string, string, any; absent | Legacy metadata accepted for migration; no general user-facing routing switch. |

“Boolean-like” accepts booleans, strings, or numbers and normalizes familiar true/false spellings. Prefer actual YAML booleans. The canonical route, compatibility aliases and comment fields are recorded in `route-manifest.json` after a build. A changed slug or deployment base can alter pathname-based comment matching; a `translationKey` does not override identity.

## Examples

Minimal post:

```md
---
title: A first post
date: '2026-09-24'
---

Hello Aurora.
```

Full post with a custom path and migration identity:

```md
---
title: Release notes
date: '2026-09-24'
updated: '2026-09-25'
description: What changed this week.
slug: release-notes
permalink: /notes/releases/
legacyUid: stable-old-id
legacyPermalinks: [/post/old-release/]
tags: [release, notes]
categories: [Journal]
cover: /images/release.png
feature: true
pinned: true
toc: true
comments: true
rss: true
sitemap: true
---

The content goes here.
```

Translated pair: create separate files with `lang: en` and `lang: zh-CN`, and the same `translationKey: welcome`. Their titles and slugs can differ; the Chinese route gains `/cn/`. For a draft, set `draft: true` and remove it before publishing. To omit a public post from RSS or sitemap, set `rss: false` or `sitemap: false` independently. A page in `src/content/pages/projects.md` can use `title: Projects`, `date: '2026-09-24'` and ordinary Markdown; its URL is `/page/projects/`.

English `src/content/posts/welcome-en.md`:

```md
---
title: Welcome
date: '2026-09-24'
lang: en
translationKey: welcome
slug: welcome
---

Welcome to the blog.
```

Chinese `src/content/posts/welcome-zh.md`:

```md
---
title: 欢迎
date: '2026-09-24'
lang: zh-CN
translationKey: welcome
slug: huan-ying
---

欢迎来到博客。
```

Page `src/content/pages/projects.md`:

```md
---
title: Projects
date: '2026-09-24'
description: Things I made.
---

My projects.
```

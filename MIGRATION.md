# Migrating from Aurora 2.x to Aurora 3.0

Aurora 3.0 is a static Astro implementation of Aurora. It preserves the compatibility information that can be established from the legacy theme/plugin and uses Vue only for focused browser interactions. It does not run the old Hexo/Vue SPA at runtime.

This guide is written for a real Aurora 2.x site. The repository fixtures prove the migration contract, but no production article corpus or external comment-provider records were available here. Verify representative URLs and comment threads from the site being migrated before switching traffic.

## Before you migrate

Record the existing site's generated URLs, titles, frontmatter, comment-provider settings, asset paths, and deployment root. Preserve a copy of the old generated site and provider configuration until the new build has been checked. In particular, collect the current canonical path and comment key for every post whose title or slug will change.

Install the required toolchain and create a working copy:

```sh
git clone https://github.com/yanpuzhen/astro-theme-aurora.git
cd ./astro-theme-aurora
pnpm install --frozen-lockfile
```

## Automatically compatible

The content adapter accepts the legacy forms covered by the RC fixtures:

- scalar or array `tags` and `categories`;
- `author` strings or objects, with the legacy `blog-author` fallback;
- `date`, `updated`, `excerpt`/`abstracts`/`preview`, `keywords`, `feature`, `sticky`, `pinned`, `comment`, and `comments` fields;
- explicit legacy UIDs, or the audited MD5 title hash (`post_uid___<title>` for posts and `page_uid___<title>` for pages);
- `/post/<slug>/` paths, explicit custom permalinks, and verified `.html` compatibility redirects;
- Markdown tables, blockquotes, Aurora containers, images, links, Unicode, and Shiki code metadata used by the fixtures.

The build emits a route manifest with canonical paths, legacy paths, UIDs, comment paths, and provider-specific comment aliases. It also generates static tags, categories, archives, pagination, RSS, sitemap, robots, canonical metadata, OpenGraph, and JSON-LD.

## Manual migration required

1. Copy posts into `src/content/posts/` and pages into `src/content/pages/`. Keep their frontmatter until `pnpm test` and `pnpm build` pass.
2. Review every custom permalink and title-derived UID. A changed title can change the legacy UID even if the visible slug stays the same.
3. Configure `ASTRO_SITE` and `ASTRO_BASE` for the real deployment. `ASTRO_BASE=/` is the root deployment; a subdirectory must include its trailing slash, for example `/blog/theme/`.
4. Copy public assets into `public/` and update references to be base-path aware. Do not hard-code root-relative URLs for a subdirectory deployment.
5. Configure one supported comment provider with [.env.example](.env.example), then compare generated identities with the old site. Existing provider records are not verified by this repository's fixtures.
6. Run the root and nested-base browser checks against a production-like preview before changing DNS or hosting configuration.

## Changed behavior

### Astro replaces the Hexo/Vue runtime

Astro owns content collections, routing, pagination, taxonomy, metadata, and article HTML. The generated page contains the article body without a client request. Vue is limited to search, comments, lightbox, code copy, Dia, theme persistence, and mobile navigation. There is no Vue Router, SPA shell, runtime article JSON fetch, or global Vue mount.

### Markdown scripts are disabled by default

Legacy Markdown that contains a `<script>` element is removed or made inert by the default pipeline. This is an intentional security and compatibility change: a content file cannot silently execute arbitrary browser code during migration. Use a reviewed Astro/Vue integration or an explicit trusted-embed path for content that genuinely needs a script. Do not re-enable arbitrary Markdown scripts globally.

### Search is build-time Pagefind

Pagefind indexes the generated HTML, including the configured language indexes. The old search JSON/API and client-side article store are not generated. Rebuild after changing content so the search index reflects the site.

### URLs and base paths

The canonical URL is composed from `ASTRO_SITE` and `ASTRO_BASE`. The legacy `/api/articles/<slug>.json` endpoint is not emitted. `/post/<slug>/`, custom permalinks, and proven `.html` aliases remain the compatibility surface; route collisions and reserved taxonomy paths fail the build.

## Comments and identity

| Provider | Aurora 3.0 default identity | Migration action |
| --- | --- | --- |
| Gitalk | Preserved legacy UID; explicit pathname mode is available | Compare UID/pathname with the existing issue records. A trusted OAuth/proxy service is required; no client secret is serialized. |
| Valine | Historical pathname without trailing slash | Compare the old pathname for representative posts. |
| Twikoo | Historical pathname with trailing slash | Compare the old pathname and environment ID. |
| Waline | Historical pathname with trailing slash | Compare the old pathname and server URL. |

The route manifest provides aliases, but it cannot prove that an external provider's records still resolve. Production continuity is therefore a required site-specific sign-off, not an automatic RC claim.

## Deprecated and removed

- Hexo generators, filters, injectors, and the legacy Vue SPA runtime are not part of Aurora 3.0.
- Legacy `/api/*.json` output is removed unless a future release explicitly adds a separately audited compatibility export.
- Runtime search/article data stores and Vue Router are removed.
- Automatic execution of Markdown scripts is removed.
- Author pages, comment counts/recent-comment data, complete legacy fence metadata, and responsive image-source migration remain conditional or incomplete until a real production corpus requires them; do not assume those behaviors from the fixtures.

## Verification checklist

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
ASTRO_SITE=https://example.com ASTRO_BASE=/aurora/ pnpm build
ASTRO_SITE=https://example.com ASTRO_BASE=/blog/theme/ pnpm build
PLAYWRIGHT_BASE_PATH= pnpm run test:browser
PLAYWRIGHT_BASE_PATH=/aurora pnpm run test:browser
```

Do not publish until generated URLs/assets, no-JavaScript content, browser console output, search, and the real comment-provider identities have been checked for the target site.

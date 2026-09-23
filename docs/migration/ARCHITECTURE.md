> Current-head note (2026-09-24): giscus, Waline, and Twikoo are first-class runtimes; Valine is legacy; Gitalk is removed from active configuration and exists only in migration tooling. The older architecture text below records the pre-replacement state.

> Status note: the current runtime classification is Waline/Twikoo first-class, Valine legacy runtime, and Gitalk identity/migration compatibility only.

# Aurora 3.0 target architecture

Aurora 3.0 is an Astro site with Astro Content Collections as the only content source and Astro file routes as the only public routing system. Vue remains an enhancement layer for interaction. The visual language, class names, gradients, assets, and content presentation are migrated from Aurora 2.x unless an Astro constraint requires a change.

## Build graph and ownership

```text
Markdown / MDX + legacy frontmatter
              |
              v
Astro Content Collections (Zod schema + compatibility normalization)
              |
              +--> canonical route resolver
              +--> metadata, JSON-LD, sitemap inputs
              +--> tags, categories, archives, pagination
              +--> feature/pin ordering and previous/next
              |
              v
Astro layouts and static HTML
              |
              +--> Vue islands only for comments, search, lightbox, Dia,
                   theme/language/mobile controls when interaction is needed
```

**Astro owns:** collection loading and validation; Markdown/MDX rendering; route generation; `site`/`base` URL composition; post/page/tag/category/archive/author URLs; pagination; feature/pin selection; previous/next; metadata and JSON-LD; locale-specific static labels; safe public configuration; CSS and asset bundling.

**Vue owns:** DOM interaction that cannot be expressed as links/forms/CSS; comment provider SDK lifecycle; search input/results; lightbox state; Dia animation/tips; theme/language/mobile menu state where needed. An island receives serializable props and never fetches Aurora article JSON.

There is no Vue Router, Pinia requirement, client-side article fetch, or generated article JSON in the canonical build.

## Content model

Use `src/content.config.ts` with a `posts` collection and a `pages` collection. The schema accepts legacy scalar/array forms and normalizes them in the loader or a typed adapter:

- `title: string` (required for public entries)
- `date: Date` (required), `updated?: Date`
- `tags: string | string[]`, `categories: string | string[]` (default `[]`)
- `cover?: string`, `description?: string`, `keywords?: string | string[]`
- `author?: string | AuthorObject`; `feature?: boolean`; `sticky?: boolean`; `pinned?: boolean`
- `slug?: string`; `permalink?: string`; `uid?: string`; `legacyUid?: string`
- `photos?: string[]`; `toc?: boolean | string`; `comment?: boolean`; `comments?: boolean`
- `lang?: 'en' | 'zh-CN' | 'zh-TW' | string`; `hidden?: boolean`; `published?: boolean`; `draft?: boolean`
- compatibility fields discovered in the mapper: `abstracts`, `preview`, `excerpt`, `categoryMode`, arbitrary page `data`, and `type`.

The adapter converts `sticky`/`pinned` to one `pinned` boolean, `comment`/`comments` to one `comments` boolean, and string keywords to arrays for internal use while preserving a string for SEO serialization. Unknown fields are retained in an `extras` record during migration and removed from the public schema after fixture coverage.

Authors normalize to `{ name, slug, avatar?, link?, description?, socials? }`. A string author first resolves against theme `authors`; otherwise the site author fallback uses slug `blog-author`, matching the legacy mapper.

`uid` precedence is `frontmatter.uid`/`legacyUid`, then the legacy title hash (`generateUid('post_uid___' + title)`) for posts and `generateUid('page_uid___' + title)` for pages. A generated UID is stored in the normalized entry and never recomputed in a component.

## Canonical routing

`src/lib/routing.ts` owns route resolution. `resolvePostPath(post)` returns a path relative to Astro's `base`, with a leading slash and no duplicated base. Initial supported modes:

- default: `/post/<slug>/`
- legacy extension mode: `/post/<slug>.html`
- uid mode: `/post/<legacyUid>/` when the migrated site selected `site.pathSlug: uid`
- explicit `frontmatter.permalink` for a verified legacy URL.

The resolver is deliberately small: a discriminated `permalinkMode` (`slug`, `uid`, `explicit`) plus a future adapter for date/blog patterns. It does not evaluate arbitrary Hexo permalink templates. A route manifest records canonical path, legacy aliases, UID, and comment ID for every entry. If a former URL cannot be emitted directly, generate a static redirect page and include it in the manifest; do not add a client router fallback.

Other routes are generated from the same resolver helpers: `/tags/`, `/tags/<slug>/`, `/categories/`, `/categories/<slug>/`, `/archives/`, `/archives/<page>/`, `/page/<slug>/`, `/authors/<slug>/` (opt-in), and `/search/` (the search UI only). Existing `/about`, `/links`, `/tags`, and `/archives` menu URLs remain available.

Astro's `site` and `base` are the only origin/root settings. Every internal URL uses `Astro.site`, `import.meta.env.BASE_URL`, or `getRelativeLocaleUrl`-style helpers; components must not concatenate `window.location`, `VITE_APP_PUBLIC_PATH`, or a hard-coded root.

## Static output and SEO

`output: 'static'` is required. A post page renders the article body from the Content Collection directly in generated HTML. Metadata is built at render time: title, description, canonical, OpenGraph (`og:type=article`, image, locale), Twitter card, author, published/modified time, tags, and language. JSON-LD uses `Article`/`BlogPosting` with the canonical URL and image. No client script repairs SEO fields.

## Markdown, HTML, and highlighting

Astro's remark/rehype pipeline is the single renderer. Add a custom remark/rehype plugin for Aurora containers and blockquote decoration; test `:::tip`, `warning`, `danger`, `details`, and malformed delimiters against real posts. Use Shiki through Astro's integration with the existing theme/background and a rehype transform for code titles, line numbers, line highlighting/focus, and the copy-button hook. Math and raw HTML are opt-in extensions with fixtures.

Raw HTML may render when enabled by the collection/content policy, but `<script>` elements from Markdown are removed or inert by default. Trusted authors can use an explicit MDX component (for example `TrustedEmbed`) or a site-level allowlisted injection config. Legacy `injects.scripts` is not copied into post bodies automatically.

## Search

Use Pagefind by default: it is static-hosting friendly, has no runtime API, indexes rendered HTML, and keeps the client bundle small. Verify Chinese tokenization and title/tag weighting with a fixture corpus. If Chinese quality is insufficient, use a build-generated MiniSearch index as the documented fallback; do not emit `api/search.json` or ship all post bodies to a Vue store. The search modal is a Vue island over the generated index.

## Comments and identity

`CommentIsland` receives only the selected runtime provider and its serializable public settings. Runtime adapters cover Valine, Twikoo, and Waline; Gitalk is not bundled. Identity policy remains explicit: the migration helper preserves Gitalk legacy UID by default and its pathname mode; Valine/Twikoo/Waline preserve their historical pathname keys. Aurora 2 Gitalk migration recognition retains only safe identity fields. Never silently switch an existing provider from UID to pathname or serialize OAuth secrets into page props.

## I18N and state

`en`, `zh-CN`, and `zh-TW` dictionaries move to build-time TypeScript/JSON messages. Static labels and metadata use the build locale. A language switcher may be a small island that navigates to locale-prefixed pages or persists a preference for controls; it must not hydrate the site shell just to translate static text. Pinia is removed. Each island owns local state; shared state is represented by URL/query parameters or server-rendered props.

## Migration invariants

- A post's generated HTML contains its title, metadata, and article body without a network request.
- One path resolver supplies links, canonical metadata, comments, pagination cards, and redirects.
- `base: '/'` and `base: '/blog/'` builds pass the same route/link tests.
- No component imports Axios, Vue Router, or a legacy JSON endpoint.
- Every legacy URL/comment identifier is either preserved or listed in the redirect/identity manifest.

# Aurora 3.0 legacy audit

**Audit source.** This audit is based on the current `auroral-ui/hexo-theme-aurora` and `auroral-ui/hexo-plugin-aurora` implementations (shallow checkouts inspected on 2026-09-19), not only their READMEs. The theme is a Vite/Vue SPA and the plugin is a Hexo generator/filter/injector package.

## Current data and render flow

1. Hexo supplies `site.posts`, `site.pages`, `site.tags`, `site.categories`, and merged site/theme configuration to `lib/generators/index.js`.
2. `PostGenerator` sorts published posts by date, removes/reorders feature or pinned posts, maps each post, computes `prev_post`/`next_post`, groups authors, then emits:
   - `api/posts/<n>.json` (home pagination; 12 items in feature mode, 13 otherwise),
   - `api/archives/<n>.json` (date-sorted pagination),
   - `api/articles/<slug>.json` (full article),
   - `api/features.json`, and `api/authors/<author>.json`.
3. `TagGenerator` and `CategoryGenerator` use `hexo-pagination` with `perPage: 0`, then emit list indexes and one JSON document per slug (`api/tags*.json`, `api/categories*.json`).
4. `PageGenerator` maps every Hexo page to `api/pages/<source>.json`; the special page generator creates `about/index.html`, `tags/index.html`, `archives/index.html`, `links/index.html`, custom `page/*` HTML shells, and `tags/search/index.html` shells.
5. `SearchGenerator` emits `api/search.json` unless Algolia is enabled. `SiteGenerator` serializes the merged Hexo/theme config to `api/site.json` after removing `deploy` and `server`; it leaves only an Algolia enable flag. `StatisticGenerator` emits `api/statistic.json`.
6. Vue mounts from `src/main.ts`, creates Pinia, Vue Router, vue-i18n, click-away, lazy-load and scroll-spy plugins, then mounts `App.vue`. `App.vue` fetches `site.json` before rendering meaningful content; route components fetch their own JSON and inject article HTML with `v-html`.
7. The Axios base URL is `VITE_APP_PUBLIC_PATH + VITE_APP_BASE_API`; it is independent of Hexo's `url/root` and is therefore a separate base-path system.

## Generated fields and compatibility facts

| Legacy behavior | Evidence | Aurora 3.0 decision |
|---|---|---|
| UID is `generateUid('post_uid___' + post.title)`; page UID is the same pattern with `page_uid___`. | `lib/helpers/mapper.js`, `lib/helpers/utils.js` | Preserve the legacy UID algorithm when the title is unchanged; store an explicit `legacyUid` override for renamed content. |
| `site.pathSlug: uid` makes the public slug the title-derived UID; otherwise the Hexo slug is used. | `postMapper` and `_config.yml` | Canonical resolver supports `slug` and `uid` modes, with an explicit per-entry `permalink` escape hatch. |
| Public mapped permalink is `/post/<slug>` while the JSON path is `/api/articles/<slug>.json`. | `postMapper` | `/post/<slug>/` is canonical; JSON is not a runtime dependency. Optional compatibility redirects are generated separately. |
| Posts are filtered by `published`; hidden posts are excluded from lists/features, but the mapper still carries `hidden`. | `PostGenerator.sortByDate`, `addPaginationPost` | `draft`/future/hidden entries never receive public pages unless an explicit preview build is added. |
| Feature mode requires three usable feature/fill posts. Otherwise generator switches to pin mode and marks first posts `pinned`. | `reorderFeaturePosts` | Preserve this rule in a pure build-time selector and document the deterministic ordering. |
| Previous/next are adjacent entries after feature/pin reordering, not simply adjacent by date. | `PostGenerator.transform` | Preserve ordering semantics, but expose typed `prev`/`next` references. |
| Tag/category APIs contain post-list projections and counts; category lists are date-sorted. | `tag.js`, `category.js`, `mapper.js` | Derive pages directly from collection entries and use one path resolver. |
| Custom quote syntax `:::tip`, `:::warning`, `:::danger`, `:::details` and blockquotes are rewritten after Hexo Markdown rendering. | `filters/afterPostRender/quote.js` | Replace with a remark/rehype plugin or explicit MDX components; no post-render regex pass in the browser. |
| Shiki is initialized synchronously through `deasync`; fence metadata is parsed by `fenceparser`; output adds copy button and language label. | `lib/highlighter/index.js` | Use Astro/Shiki build-time highlighting and a small copy-button island. Preserve supported fence metadata through tests. |
| Raw HTML is passed through Hexo and then rendered with `v-html`; injected scripts/CSS and CDN locale snippets are configured in `_config.yml`. | `injector/index.js`, `src/pages/post/[slug].vue` | Markdown raw HTML is allowed only by an explicit policy; scripts are inert by default. Site-level scripts require an explicit trusted config/MDX component. |
| Article text is truncated from `abstracts` or `content` (`preview`/80); search strips tags and indexes title/content/categories/tags/author. | `mapper.js`, `search.js`, `SearchModal.vue` | Generate excerpt/search fields at build time; never restore the whole article JSON API for search. |
| Authors can be a configured author key, an object, or site fallback `blog-author`; author pages are JSON-only today. | `authorMapper`, `addAuthorPost`, `Profile.vue` | Normalize a typed author object; generate `/authors/<slug>/` only when enabled. |
| Gitalk accepts `id: uid` or `id: pathname`; Valine uses pathname; Twikoo uses pathname; Waline uses its own current page path. | `Comment.vue` and comment utility modules | Pass a stable `commentId` and legacy aliases to an island; never silently change the provider key. |
| Locale files are `en`, `zh-CN`, `zh-TW`; Vue i18n changes locale client-side and route guards set document titles. | `src/locales`, `router/guard.ts` | Render static labels at build time per configured locale; hydrate only controls that actually change locale. |
| `theme_config` is serialized to the client, including menu, socials, plugin settings and gradient values. | `SiteGenerator`, `ThemeConfig.class.ts` | Validate a public-safe Astro config and never serialize secrets such as Gitalk client secret. |

## Module classification

| Legacy module | Current responsibility | Hexo coupling | Vue coupling | Target architecture | Action | Risk |
|---|---|---:|---:|---|---|---|
| `hexo-plugin-aurora/lib/generators/*` | JSON APIs, shell pages, feature/author/statistics/search data | High | Indirect | Astro content queries and static routes | REWRITE | High: URL and ordering drift |
| `lib/helpers/mapper.js`, `symbols-count-time.js`, `toc.js`, `truncate-html.js` | Data projection, UID, TOC, excerpt, counts | High | Medium | Typed build-time adapters/utilities | ADAPT | High: comment IDs and excerpt compatibility |
| `lib/filters/afterPostRender/quote.js` | Quote/details HTML rewrite | High | None | remark/rehype plugin or MDX components | REWRITE | Medium: malformed legacy syntax |
| `lib/highlighter/index.js` | Shiki HTML, fence metadata, copy markup | High | CSS/UI only | Astro/Shiki pipeline + copy island | REWRITE | Medium: syntax and CSS compatibility |
| `lib/injector/index.js` | CDN, SEO, custom script/CSS injection | High | None | Astro head/config integration with allowlist | REWRITE | High: unsafe script and secrets |
| `src/api`, Axios request utility | Runtime JSON transport | None | High | Removed; direct collection props | REMOVE | High if a component still fetches JSON |
| `src/router`, `vite-plugin-pages`, `src/pages/*.vue` | SPA routing and data-fetching screens | None | High | Astro file routes and `.astro` templates | REWRITE | High: route/base regressions |
| Pinia stores (`src/stores/*.ts`) | Runtime config, article, list, search, UI state | None | High | Local Astro props; island-local state | REMOVE / ADAPT | Medium: hidden shared-state dependencies |
| `src/models/*.class.ts` | Mutable JSON model wrappers | Medium | High | Zod schema and immutable derived types | REWRITE | Medium |
| `src/styles/**`, `src/icons/**`, static assets | Aurora visual system, icon masks, typography | None | None | Imported global CSS/assets | KEEP / ADAPT | Medium: CSS build order |
| Layout visual components (`Header`, `Footer`, `ArticleCard`, `Feature`, `Sidebar`, `Tag`, `Title`, `Link`, buttons, skeletons) | Presentational UI | None | Medium | Astro components with shared props | ADAPT | Medium |
| `SearchModal.vue` | Keyboard/search modal, recent searches, API index | None | High | Pagefind/MiniSearch-backed Vue island | REWRITE as VUE_ISLAND | Medium |
| `Comment.vue`, `utils/comments/*`, `useCommentPlugin.ts` | Gitalk, Valine, Twikoo, Waline and recent/count calls | None | High | Provider adapter Vue island | REWRITE as VUE_ISLAND | High: existing threads |
| `Dia.vue`, `utils/aurora-dia/*` | Animated bot and contextual tips | None | High | Optional Vue island | ADAPT as VUE_ISLAND | Low |
| `VueEasyLightbox`, `useLightBox.ts` | Runtime gallery | None | High | Small lightbox island, static image markup first | ADAPT as VUE_ISLAND | Medium |
| `MobileMenu.vue`, `Controls.vue`, `ThemeToggle.vue`, dropdowns | Menu/theme/language controls | None | High | Static links plus focused islands | ADAPT as VUE_ISLAND | Medium |
| `Navigator.vue`, `ProgressBar.vue`, `Toggle.vue`, scroll-spy | Scroll/navigation/loading affordances | None | High | CSS/native anchors; optional islands | ADAPT / REMOVE | Low |
| `src/locales/*` | Runtime translation dictionaries | None | High | Build-time dictionaries; island subset | ADAPT | Medium |

## Vue component disposition

- **ASTRO_STATIC:** `ArticleCard`, `HorizontalArticle`, `Breadcrumbs`, `PrimaryButton`, `SecondaryButton`, `Feature`, `FeatureList`, `FooterContainer`, `FooterLink`, `Logo`, `Navigation` (links), `Header` shell, `LinkAvatar`, `LinkBox`, `LinkBoxTitle`, `LinkCard`, `LinkCategoryList`, `LinkList`, `Profile` (data-only), `CategoryBox`, `TagBox`, `Toc` (anchor list), `Sidebar` shell, `MainTitle`, `SubTitle`, `TagItem`, `TagList`, `Social`, `PostStats` (when stats are build-time), `PageContent`, `SvgIcon`, skeleton markup where useful.
- **VUE_SERVER_RENDERED:** none required for the first migration. If a component needs Vue templates for reuse without browser code, render it through Astro's Vue integration and do not add `client:*`.
- **VUE_ISLAND:** `Comment`, `SearchModal`, `Dia`, `MobileMenu` interactive behavior, `ThemeToggle`, lightbox behavior, and any provider-specific comment/reaction/count widgets.
- **REMOVE_OR_REWRITE:** `App.vue`, Vue Router pages, router guard, Axios API layer, all data-fetching Pinia stores, `NProgress` route loading, `vue3-lazyload` directives, and the SPA-only catch-all page.

## Open audit risks

- The upstream theme checkout contains no content samples, so fixture posts must be collected from real Aurora users before declaring frontmatter compatibility complete.
- Hexo's effective permalink can come from site config and plugins beyond this repository; migration must inventory a real site's generated URLs before changing the resolver.
- Existing comments cannot be validated from source alone. A fixture must record the exact Gitalk issue label/path, Valine/LeanCloud path, Twikoo path, and Waline path for representative posts.

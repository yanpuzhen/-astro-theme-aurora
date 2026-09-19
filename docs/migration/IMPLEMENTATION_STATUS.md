# Aurora 3.0 implementation status

This is the implementation ledger for Phase 2. It records work in the repository; the accepted ADRs remain the architecture source of truth.

| Legacy feature | Legacy file/module | Astro target | Status | Notes | Verification method |
|---|---|---|---|---|---|
| Post frontmatter and UID mapping | `hexo-plugin-aurora/lib/helpers/mapper.js`, `utils.js` | `src/content.config.ts`, `src/lib/content.ts` | In progress | Preserve scalar/array fields, legacy UID hash, author fallback and compatibility extras. | Collection fixtures and normalized-data checks |
| Post URL generation | `postMapper`, `site.pathSlug` | `src/lib/routing.ts`, route manifest | In progress | Slug, UID, explicit permalink and `.html` aliases are centralized. | Route fixtures and generated paths |
| Home post ordering | `generators/post.js` | `src/lib/posts.ts`, home routes | Planned | Keep feature/pin fallback, date ordering and legacy page sizes. | Ordering and pagination assertions |
| Article body | Vue `pages/post/[slug].vue`, Hexo Markdown | Astro post route and Content Collections | Skeleton only | Article HTML must remain in the initial document. | `dist` HTML assertions |
| Aurora layout and visual system | `theme/src/styles/**`, layout components | `src/styles/global.css`, Astro layouts/components | Planned | Migrate class vocabulary and gradient variables without introducing a UI framework. | Build plus responsive visual review |
| Tags and categories | `generators/tag.js`, `category.js` | Static taxonomy routes | Planned | Derive indexes from the same normalized collection. | Route and count assertions |
| Archives | `generators/post.js` archive pagination | Static archive routes | Planned | Preserve date-sorted, feature-independent archive ordering. | Archive fixture assertions |
| Markdown containers and highlighting | `filters/afterPostRender/quote.js`, `highlighter/index.js` | Astro Markdown pipeline and build-time transforms | Planned | One Remark/Rehype/Shiki pipeline; scripts remain inert by default. | Markdown fixture output |
| Search | `generators/search.js`, `SearchModal.vue` | Pagefind build output and search island | Planned | No legacy full-content JSON endpoint. | Pagefind index and Chinese fixture search |
| Comments | `Comment.vue`, `utils/comments/*` | Comment identity adapter and island | Planned | Preserve provider-specific UID/path semantics; secrets never become props. | Identity manifest fixtures |
| Lightbox | `useLightBox.ts`, `VueEasyLightbox` | Small Vue island over static image links | Planned | Images remain usable without JavaScript. | Static HTML and browser interaction |
| Dia | `Dia.vue`, `utils/aurora-dia/*` | Optional Vue island | Planned | Build-time config and locale props only. | Island smoke check |
| SEO and feeds | `injector/index.js`, route metadata | Base layout, RSS, sitemap, robots | Planned | All URLs derive from `site` and `base`. | Generated HTML/feed checks |

## Current baseline

- The repository was clean at the start of Phase 2 and remains based on `cbfe173`.
- The existing smoke post is retained while real compatibility fixtures are added.
- The upstream legacy repositories referenced by `LEGACY_AUDIT.md` were inspected at their current shallow HEADs on 2026-09-19. Their source is not copied into the Astro repository.
- Exact provider-side comment records cannot be proven from theme source alone; the implementation will expose an explicit migration manifest and mark site-specific values for operator verification.

## Verification convention

Each completed logical stage records the commands used for Astro checking, production build, relevant assertions, `git diff --check`, and generated-output inspection in the commit handoff.

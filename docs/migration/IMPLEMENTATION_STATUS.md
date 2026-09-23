> Current-head note (2026-09-24): the giscus replacement supersedes the older Gitalk identity-compatibility classification below. Gitalk is removed from active runtime/configuration and retained only for migration checks.

> Status note: the Gitalk runtime blocker described in older audit snapshots is superseded by the accepted migration-only classification on 2026-09-23.

# Aurora 3.0 implementation status

This is the implementation ledger for Phase 2. It records work in the repository; the accepted ADRs remain the architecture source of truth.

| Legacy feature | Legacy file/module | Astro target | Status | Notes | Verification method |
|---|---|---|---|---|---|
| Post frontmatter and UID mapping | `hexo-plugin-aurora/lib/helpers/mapper.js`, `utils.js` | `src/content.config.ts`, `src/lib/content.ts` | Implemented | Scalar/array fields, legacy UID hash, author fallback, visibility and compatibility extras are normalized. | Legacy-shaped fixtures, generated manifest and static HTML |
| Post URL generation | `postMapper`, `site.pathSlug` | `src/lib/routing.ts`, route manifest | Implemented | Slug, UID, explicit permalink, `.html` aliases and base-aware paths are centralized. | Route manifest plus root/non-root builds |
| Home post ordering | `generators/post.js` | `src/lib/posts.ts`, home routes | Implemented | Feature capacity/fill and pin fallback preserve the audited 12/13 page-size behavior. | Fixture build and generated home/archive routes |
| Article body | Vue `pages/post/[slug].vue`, Hexo Markdown | Astro post routes and Content Collections | Implemented | Article HTML, metadata, TOC and navigation are in the initial document; previous/next follows the same feature/pin ordering as home. | `scripts/verify-build.mjs` |
| Aurora layout and visual system | `theme/src/styles/**`, layout components | `src/styles/global.css`, Astro layouts/components | Implemented, visual review pending | Static Aurora-inspired shell, gradients, typography, cards and responsive rules are restored; exact screenshot parity remains review work. | Build plus source audit; screenshot review pending |
| Tags and categories | `generators/tag.js`, `category.js` | Static taxonomy routes | Implemented | Derived from the normalized collection, including nested category paths. | Generated route tree and build |
| Archives | `generators/post.js` archive pagination | Static archive routes | Implemented | Date-sorted list and static pagination; archive page 1 is sliced before grouping. | Generated archive routes and build |
| Markdown containers and highlighting | `filters/afterPostRender/quote.js`, `highlighter/index.js` | Astro Markdown pipeline and build-time transforms | Implemented, parity review pending | One Remark/Rehype/Shiki pipeline, Aurora containers, tables, heading IDs and inert scripts; fence title/line metadata needs review, while copy is a separate small island. | Rich Markdown fixture in `dist` |
| Search | `generators/search.js`, `SearchModal.vue` | Pagefind build output and search island | Implemented | Pagefind indexes rendered canonical HTML; no legacy full-content JSON endpoint. | Pagefind output and Chinese language index |
| Comments | `Comment.vue`, `utils/comments/*` | Comment identity adapter and focused runtime islands | Implemented; bundled provider production checks remain site-specific | Waline/Twikoo are first-class runtimes; Valine is legacy runtime; Gitalk is identity/migration compatibility only and never a runtime selection. | Unit/config/browser-mock checks; provider records not supplied |
| Lightbox | `useLightBox.ts`, `VueEasyLightbox` | Small Vue island over static image links | Implemented | Static image remains present; only the dialog/listener logic hydrates. | Rich Markdown output and island bundle |
| Dia | `Dia.vue`, `utils/aurora-dia/*` | Optional Vue island | Implemented | Opt-in `PUBLIC_AURORA_DIA=true`; locale/tip are serializable props. | Bundle inspection and build |
| SEO and feeds | `injector/index.js`, route metadata | Base layout, RSS, sitemap, robots | Implemented | Metadata and feed URLs derive from `site` plus `base`; JSON-LD is emitted server-side. | Generated HTML/feed checks |

## Current baseline

- The repository was clean at the start of Phase 2 and remains based on `cbfe173`; implementation tracking itself was committed as `4228345`.
- The existing smoke post is retained alongside legacy-shaped compatibility fixtures.
- The upstream legacy repositories referenced by `LEGACY_AUDIT.md` were inspected at their current shallow HEADs on 2026-09-19. Their source is not copied into the Astro repository.
- Exact provider-side comment records cannot be proven from theme source alone; the implementation exposes an explicit migration manifest and marks site-specific values for operator verification.
- Gitalk is intentionally not a bundled runtime in Aurora 3; its upstream browser-visible secret requirement is an accepted product boundary, not a Stable Preflight blocker. See `docs/migration/BLOCKERS.md`.

## Verification convention

Each completed logical stage records the commands used for Astro checking, production build, relevant assertions, `git diff --check`, and generated-output inspection in the commit handoff.

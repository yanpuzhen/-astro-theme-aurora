# Aurora 3.0 migration checklist

This is the implementation handoff checklist. Decisions in `docs/migration/adr/` marked **ACCEPTED** are contractual; update an ADR before changing them. Keep each change small and preserve the visual styles from the legacy theme.

## Phase 1 - Astro skeleton

- [ ] Initialize an Astro TypeScript project with `output: 'static'`.
- [ ] Add `@astrojs/vue` and configure Vue islands without a global Vue mount.
- [ ] Add `site` and `base` configuration with environment examples for `/` and `/blog/`.
- [ ] Add the base layout, global Aurora styles, fonts, icons, favicon and default cover.
- [ ] Add a smoke page that renders the configured base URL through an internal link.
- [ ] Add typecheck and static build scripts.

## Phase 2 - Content pipeline

- [ ] Define the Zod Content Collections schema for posts and pages.
- [ ] Implement legacy scalar/array normalization for tags and categories.
- [ ] Normalize authors, `comment/comments`, `sticky/pinned`, keywords, dates and visibility.
- [ ] Implement legacy post/page UID generation and explicit UID overrides.
- [ ] Port excerpt, symbol count, reading time and TOC generation to build-time utilities.
- [ ] Port Aurora containers/blockquotes to one remark/rehype pipeline.
- [ ] Configure Shiki and cover code title, line number, line highlight/focus and copy hooks.
- [ ] Add fixtures for raw HTML, script removal/inert behavior, math and representative fence metadata.

## Phase 3 - Core routing/pages

- [ ] Implement `resolvePostPath` and route-manifest types.
- [ ] Add base-aware URL helpers; ban direct root concatenation in components.
- [ ] Implement static `/post/[...slug]` (or equivalent) with article HTML in the document.
- [ ] Add title/description/canonical/OpenGraph/Twitter/author/date/tag/language metadata.
- [ ] Add Article/BlogPosting JSON-LD.
- [ ] Implement home listing, deterministic feature/pin ordering and pagination.
- [ ] Implement archives and archive pagination.
- [ ] Implement tags index and tag detail pages.
- [ ] Implement categories index and category detail pages.
- [ ] Implement about, links and custom page entries.
- [ ] Implement optional author pages from normalized author data.
- [ ] Implement previous/next links using the same ordered collection as home pages.

## Phase 4 - Aurora UI migration

- [ ] Port header, navigation, logo, footer, profile and social presentation to Astro components.
- [ ] Port article cards, feature cards, tags, category boxes, sidebar, TOC and breadcrumbs.
- [ ] Port link/friends layouts and page-specific data without runtime article requests.
- [ ] Import legacy SCSS variables/component styles and verify desktop/mobile screenshots.
- [ ] Preserve gradients, profile shapes, cover behavior, dark mode and spacing.
- [ ] Replace lazy-load directives and scroll-spy directives with native/isolated equivalents.

## Phase 5 - Interactive features

- [ ] Implement the search island over Pagefind (or the documented MiniSearch fallback).
- [ ] Implement the comments island and four provider adapters.
- [ ] Implement comment count/recent-comment behavior only where provider APIs support it.
- [ ] Implement stable theme preference controls.
- [ ] Implement locale switching without hydrating static pages.
- [ ] Implement mobile menu interaction.
- [ ] Implement lightbox interaction over statically rendered image links.
- [ ] Port Dia as an optional island with build-time locale/config props.
- [ ] Add copy-button behavior for highlighted code as a small island.

## Phase 6 - Legacy compatibility

- [ ] Collect real Aurora/Hexo generated URL and frontmatter fixtures.
- [ ] Generate a route manifest containing canonical paths, old paths, UID and comment aliases.
- [ ] Preserve `/post/<slug>/` and verified `.html`/UID forms where practical.
- [ ] Generate static redirects for URLs that cannot be emitted directly.
- [ ] Verify Gitalk UID/pathname, Valine, Twikoo and Waline identifiers against existing comments.
- [ ] Provide a documented migration map for changed slugs/titles and comment keys.
- [ ] Remove legacy `/api/*.json` generation after consumers are migrated; retain only an explicitly requested compatibility export.
- [ ] Document raw HTML/script compatibility differences and trusted embed opt-in.

## Phase 7 - Performance and SEO

- [ ] Run Pagefind and inspect index size and Chinese search quality.
- [ ] Confirm no post page requires a client request for article content or metadata.
- [ ] Audit shipped JavaScript and list each island's reason for hydration.
- [ ] Validate image dimensions, lazy loading, responsive sources and default cover fallback.
- [ ] Validate sitemap, robots, canonical URLs and RSS/feeds if enabled.
- [ ] Build with `base: '/'` and `base: '/blog/'` and inspect every internal link/asset.

## Phase 8 - Tests and documentation

- [ ] Add schema normalization tests for all legacy forms.
- [ ] Add route resolver tests for slug, UID, explicit, `.html`, query/hash and base paths.
- [ ] Add feature/pin, pagination, tag/category/archive and previous/next tests.
- [ ] Add rendered HTML assertions proving article content and SEO metadata are static.
- [ ] Add redirect and comment identity manifest tests.
- [ ] Add Markdown/highlighting/raw HTML security fixtures.
- [ ] Run typecheck, unit tests, production build and a static preview smoke test.
- [ ] Update README/configuration docs with Astro setup and migration limits.
- [ ] Review all accepted ADRs and record any superseding decisions.

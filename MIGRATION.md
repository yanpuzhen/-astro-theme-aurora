# Aurora 3.0 migration checklist

This is the implementation handoff checklist. Decisions in `docs/migration/adr/` marked **ACCEPTED** are contractual; update an ADR before changing them. Keep each change small and preserve the visual styles from the legacy theme.

## Phase 1 - Astro skeleton

- [x] Initialize an Astro TypeScript project with `output: 'static'`.
- [x] Add `@astrojs/vue` and configure Vue islands without a global Vue mount.
- [x] Add `site` and `base` configuration with environment examples for `/` and `/blog/`.
- [x] Add the base layout (visual styles/assets remain a later UI task).
- [x] Add a smoke page that renders the configured base URL through an internal link.
- [x] Add typecheck and static build scripts.

## Phase 2 - Content pipeline

- [x] Define the Zod Content Collections schema for posts and pages.
- [x] Implement legacy scalar/array normalization for tags and categories.
- [x] Normalize authors, `comment/comments`, `sticky/pinned`, keywords, dates and visibility.
- [x] Implement legacy post/page UID generation and explicit UID overrides.
- [ ] Port excerpt, symbol count, reading time and TOC generation to build-time utilities.
- [x] Port Aurora containers/blockquotes to one remark/rehype pipeline.
- [x] Configure Shiki and add a small client copy hook for highlighted code.
- [x] Add fixtures for raw HTML, script removal/inert behavior and representative fence metadata.

## Phase 3 - Core routing/pages

- [x] Implement `resolvePostPath` and route-manifest types.
- [x] Add base-aware URL helpers; ban direct root concatenation in components.
- [x] Implement static `/post/[...slug]` (or equivalent) with article HTML in the document.
- [x] Add title/description/canonical/OpenGraph/Twitter/author/date/tag/language metadata.
- [x] Add Article/BlogPosting JSON-LD.
- [x] Implement home listing, deterministic feature/pin ordering and pagination.
- [x] Implement archives and archive pagination.
- [x] Implement tags index and tag detail pages.
- [x] Implement categories index and category detail pages.
- [x] Implement about, links and custom page entries.
- [ ] Implement optional author pages from normalized author data.
- [x] Implement previous/next links using the date-sorted archive collection.

## Phase 4 - Aurora UI migration

- [x] Port header, navigation, logo and footer to Astro components.
- [x] Port article cards, feature cards, tags, category boxes and TOC to Astro.
- [x] Port link/friends page shell and page-specific data without runtime article requests.
- [ ] Import legacy SCSS variables/component styles and verify desktop/mobile screenshots.
- [x] Preserve the audited gradients, dark mode, cover behavior and responsive spacing vocabulary.
- [x] Replace lazy-load directives with native HTML behavior; scroll-spy remains unimplemented.

## Phase 5 - Interactive features

- [x] Implement the search island over Pagefind.
- [x] Implement the comments island and four provider adapters.
- [ ] Implement comment count/recent-comment behavior only where provider APIs support it.
- [ ] Implement stable theme preference controls.
- [ ] Implement locale switching without hydrating static pages.
- [ ] Implement mobile menu interaction.
- [x] Implement lightbox interaction over statically rendered image links.
- [x] Port Dia as an optional island with build-time locale/config props.
- [x] Add copy-button behavior for highlighted code as a small island.

## Phase 6 - Legacy compatibility

- [x] Collect real Aurora/Hexo-shaped URL and frontmatter fixtures.
- [x] Generate a route manifest containing canonical paths, old paths, UID and comment aliases.
- [x] Preserve `/post/<slug>/` and verified `.html`/UID forms where practical.
- [x] Generate static redirects for URLs that cannot be emitted directly.
- [ ] Verify Gitalk UID/pathname, Valine, Twikoo and Waline identifiers against existing comments.
- [ ] Provide a documented migration map for changed slugs/titles and comment keys.
- [x] Remove legacy `/api/*.json` generation after consumers are migrated; retain only an explicitly requested compatibility export.
- [x] Document raw HTML/script compatibility differences and trusted embed opt-in.

## Phase 7 - Performance and SEO

- [x] Run Pagefind and inspect index size and Chinese search quality.
- [x] Confirm no post page requires a client request for article content or metadata.
- [x] Audit shipped JavaScript and list each island's reason for hydration.
- [ ] Validate image dimensions, lazy loading, responsive sources and default cover fallback.
- [x] Validate sitemap, robots, canonical URLs and RSS/feeds if enabled.
- [x] Build with `base: '/'` and `base: '/aurora/'` and inspect representative internal links/assets.

## Phase 8 - Tests and documentation

- [ ] Add schema normalization tests for all legacy forms.
- [ ] Add route resolver tests for slug, UID, explicit, `.html`, query/hash and base paths.
- [ ] Add feature/pin, pagination, tag/category/archive and previous/next tests.
- [x] Add rendered HTML assertions proving article content and SEO metadata are static.
- [x] Add redirect and route/comment identity manifest assertions.
- [x] Add Markdown/highlighting/raw HTML security fixtures.
- [x] Run typecheck, build assertions and production build; static preview smoke remains for Astra review.
- [ ] Update README/configuration docs with Astro setup and migration limits.
- [ ] Review all accepted ADRs and record any superseding decisions.

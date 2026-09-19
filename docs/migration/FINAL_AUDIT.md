# Aurora 3.0 final architecture and migration audit

**Audit date:** 2026-09-19  
**Scope:** Phase 2 implementation and release-candidate gate  
**Method:** read-only source/ADR review before fixes, clean-tree and commit review, generated-output inspection, and command verification.

## Evidence baseline

The working tree was clean at audit start. Phase 2 commits reviewed: `0a323e8`, `b840073`, `5950169`, `67ba23d`, `7085eee`, and `197b448`. The accepted ADRs still describe an Astro-owned static site, one route resolver, one Markdown pipeline, Pagefind, and scoped Vue islands.

The first direct `pnpm test` invocation failed because the interactive shell does not expose `node` (`sh: node: command not found`). This is an environment invocation issue, not a passing test result; the bundled workspace runtime must be used for all final verification.

## Findings

### P0 — release blockers

None identified in the source audit. Gitalk OAuth/proxy remains a conditional deployment blocker only when Gitalk is enabled, as documented in `docs/migration/BLOCKERS.md`; it does not block static content or other providers.

### P1 — correctness / compatibility

1. **Provider identity verification remains incomplete.** The implementation exposes provider-specific identity modes and aliases, but no real production records prove Gitalk UID/pathname, Valine, Twikoo, or Waline keys. This is a release compatibility risk for a site that already has comments and remains a documented migration backlog item.
2. **Legacy title-hash edge cases are not covered by executable fixtures.** The MD5 prefix matches the audited legacy helper, but whitespace, Unicode normalization, emoji, and renamed-title behavior are not regression-tested. The current normalization trims the title before hashing, so exact legacy behavior must be proven for real fixtures before changing titles.

### P2 — parity / quality

1. Legacy fence metadata (title/filename, line ranges and line numbers) is not fully proven against real posts; the current rich fixture covers highlighting and inert scripts only.
2. Author pages, locale switching, persisted theme preference, and responsive mobile-menu interaction remain unimplemented relative to the accepted migration checklist.
3. No screenshot-level visual parity review or complete browser interaction suite was present in the repository at audit start.
4. Image dimensions/responsive sources and comment count/recent-comment behavior remain incomplete.
5. The baseline CSS is a compact replacement rather than a verified import of all legacy component variables; desktop/tablet/mobile visual parity needs an explicit run.

### P3 — nice to have

Document a complete changed-slug/comment-key migration table for each production site and add broader adversarial content fixtures after a real corpus is available.

## Read-only architecture verdict

The implementation still follows the frozen architecture in its primary ownership boundaries: Astro owns collections, static routes, metadata and feeds; article content is rendered in the document; Pagefind is build-time; Vue is limited to search, comments, Dia, lightbox and code-copy enhancements; no Vue Router/Axios/Pinia or article JSON runtime is present. The findings above are targeted correctness and evidence gaps, not a proposal to change the architecture.

## Planned fixes after this audit

- Make URL/base helpers idempotent and add route-helper regression coverage.
- Add explicit route-manifest/catch-all collision detection with actionable build errors.
- Escape JSON-LD for safe embedding in an HTML script element.
- Re-run Astro check, root/base/torture-path builds, generated-output assertions, and available browser checks using the bundled Node/pnpm runtime.

## Fix and verification record

The audit fixes make `sitePath`/`withBase` idempotent, reject duplicate post canonical/alias claims and reserved taxonomy/static prefixes, preserve the historical comment path fallback, and escape `<`, `>` and `&` before embedding JSON-LD. Root, `/aurora/`, and `/blog/theme/` production builds all completed with Astro check and Pagefind; generated base-prefixed links and canonical URLs were inspected. The bundled runtime also passed `pnpm test` for root and `/blog/theme/`. `pnpm exec playwright --version` reports that Playwright is not installed in this project, so no browser-level run is claimed.

## Release gate

**READY FOR RC**, with the P1 provider-record verification and P2 parity items retained as RC backlog. No unconditional P0 release blocker was found in the repository. Gitalk remains conditionally blocked until an external OAuth/proxy endpoint is configured when that provider is enabled.

### Routing compatibility

- Canonical post paths remain `/post/<slug>/`, UID mode, or explicit legacy permalinks; `.html` forms are static redirect pages.
- Route helpers now compose `site`/`base` idempotently and work for `/`, `/aurora/`, and `/blog/theme/` builds.
- Legacy UID and aliases are recorded in the manifest; duplicate canonical or alias paths and reserved taxonomy/static overlaps fail the build with the claiming entry IDs.

### Comment compatibility

Gitalk supports UID or pathname mode; Valine, Twikoo, and Waline use historical pathname identity. The manifest carries UID, canonical path, and historical comment path aliases. Provider-side records are not available in this repository, so production thread matching remains a site-specific verification task.

### Visual parity and browser verification

The source review confirms responsive rules for desktop, tablet, and mobile breakpoints, static article HTML, and scoped islands. No screenshot comparison or browser interaction suite was available; Playwright is not installed and this limitation is recorded rather than presented as a pass.

### Performance and hydration

Article bodies and metadata are static. Search uses `client:idle`; comments, code copy, and lightbox are `client:visible`; Dia is opt-in and `client:idle`. No `client:load`, SPA router, article JSON fetch, or global content payload was found.

### Architecture verdict

The implementation continues to satisfy Astro-owned routing, static HTML, a single Remark/Rehype/Shiki Markdown pipeline, Pagefind, limited Vue islands, one `site`/`base` URL source of truth, and legacy UID/comment alias preservation.

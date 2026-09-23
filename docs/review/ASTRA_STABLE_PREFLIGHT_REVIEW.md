# Aurora 3.0 — Independent Stable-Preflight Review of PR #6

## Scope and baseline

This is a **merge-safety review**, not permission to publish stable. I reviewed the actual `dev → main` PR diff, implementation, generated ordinary/Demo/Pages artifacts, migration/security boundaries, validation scripts, documentation, and browser behavior. The three scoped areas are root user configuration, comment-provider readiness, and RSS/sitemap/robots. Astro remains the static router/content/SEO/feed generator; Vue is limited to interactive islands. I did not merge, publish, change `main`, or move a release tag.

The first pass was read-only: clean `dev` working tree at `3e394ab5e770921d4bce8b53d40d6317df6dc4e4`; `origin/main` was `28725111385f36b3b9b3bf424cb8afe5b271e25c`. `git fetch --all --tags --prune`, branch/log/tag inspection, the complete `origin/main...origin/dev` diff/name-status/stat, and PR metadata confirmed PR #6 was OPEN, not a draft, MERGEABLE/CLEAN, with the expected base/head. `v3.0.0-rc.2^{}` resolved to `b0e2d10d16a83c487c112d3a030acbe6d47d9a60`; `package.json` remained `3.0.0-rc.2`. These identities were checked rather than inferred from the handoff.

## Config architecture and validation

**PASS.** `_config.yml` is build-time YAML parsed with duplicate-key and alias limits, selected Aurora 2 aliases are normalized, strict Zod schema validates/defaults, ENV overrides win over YAML, and the resulting config is recursively frozen. Missing YAML falls back to defaults; invalid syntax, unknown canonical keys, bad enum/booleans/dates/URLs/base paths fail with useful paths. The `ASTRO_SITE`/`ASTRO_BASE` deployment overrides and optional public provider overrides were checked in source and tests. The parser/config loader stays server-side: islands receive only the specific public props they need. The ordinary UI reflects YAML title/author/subtitle, theme colors/shape, menu, social links, Dia, footer, links, and provider settings; Demo has an explicit deterministic overlay and content isolation. The `.env.example` keeps deployment/test controls distinct from routine YAML settings. User-provided external URLs and local asset paths are scheme-constrained; a separate invalid-input probe rejected `javascript:` Waline URL/avatar, encoded traversal base, and an unknown theme key.

**Fixed during review:** setting `site.language: zh-CN` made unprefixed `/search/` emit `lang="zh-CN"`, Chinese labels and a Chinese Pagefind selection, while the route and indexed English content remained English. This was a P1 i18n/config routing defect. Commit `251b9440a472640203a649e89644d36f810d347a` binds that English route to `en`; the config UI fixture now uses `site.language: zh-CN` and checks HTML language, heading, and a real English search result. The locale-specific `/cn/search/` remains Chinese. This is a route-specific correction, not an architecture change.

## Aurora 2 migration and comments

**PASS within the documented compatibility scope.** Loader/tests cover selected old menu, site/meta, socials, Dia, filing, provider and camelCase aliases. Unsupported author/analytics/injection/Shiki concepts are called out instead of being silently advertised. UID/pathname Gitalk identities, Valine clean pathname, Twikoo/Waline trailing-slash pathname, aliases, Unicode, custom permalink and translated-route isolation are asserted by identity fixtures and browser checks. Real historical comment records were not available to compare.

| Provider | Classification | Pinned client | Local evidence | External boundary |
| --- | --- | --- | --- | --- |
| Waline | First-class runtime | 3.15.2 | CSS + ES module, config/locale/dark/identity, Recent Comments and failure mock pass | Live service and records not verified |
| Twikoo | First-class runtime | 2.0.8 | HTTP/CloudBase asset selection, config/locale/identity, Recent Comments and failure mock pass | Live service and records not verified |
| Valine | Legacy runtime | 1.5.3 | Client/options, clean-path identity and theme-class mock pass | Live service and records not verified |
| Gitalk | Legacy identity/migration only | No runtime | Canonical provider selection rejects; legacy runtime fields discarded | No runtime expected |

All five pinned provider asset URLs (three scripts/module variants plus Waline stylesheet) returned HTTP 200 at review time; this checks the named asset paths, **not** provider uptime or actual backend integration. Client-side Recent Comments use Twikoo/Waline APIs without passing a DOM mount to Waline, normalize to text-only Vue interpolation, constrain avatars to HTTP(S) and links to the configured site origin/base. The malicious HTML/`javascript:` mock did not become active elements. Demo comments are separate fixed fixtures. Provider loading is conditional on enabled/configured comments and deduplicated; `none` does not request provider assets.

**Gitalk security: PASS.** Canonical `comments.gitalk.clientSecret` and secret ENV channels are rejected without echoing values. Legacy root Gitalk credentials are discarded with generic warnings; only identity mode survives. A real build using legacy `clientSecret: ASTRA_DO_NOT_LEAK_123` succeeded with the expected migration warning, and the sentinel was absent from build logs, `dist`, and `.pages-dist`. Published-asset scans showed no Gitalk runtime URL or serialized credential. This intentionally does not claim Gitalk runtime support.

## RSS, sitemap, robots, and Pages artifact

**PASS.** Astro prerenders `/rss.xml`, `/cn/rss.xml`, `/sitemap.xml`, and `/robots.txt` under the configured base. The two feeds use `@astrojs/rss`, locale-specific post selection, and public/`rss: false` filtering. Ordinary fixture builds intentionally contain 0 EN and 0 ZH items. The Demo build has **13 EN + 13 ZH** entries. I additionally injected and then removed one temporary public post per locale containing `<`, `&`, and quotes: both feeds parsed as valid XML with correct decoded metadata and absolute `/blog/theme/` links. No temporary source remains.

Sitemap XML parsed with **31 canonical URLs** in ordinary mode and **100** in Demo; aliases, internal opt-out fixtures, and foreign Demo content were absent. The robots file has an absolute base-aware sitemap line. Root, `/aurora/`, `/blog/theme/`, and final Demo `/astro-theme-aurora/demo/` base cases passed. `pnpm pages:build` kept VitePress Docs at the Pages root and all four Demo resources at `.pages-dist/demo/` while restoring an ordinary `dist`. Final local HTTP preview returned 200 for Docs EN/ZH, Demo home, both Demo feeds, sitemap, and robots. This is local staged-artifact HTTP verification, not a fresh production Pages deployment check. Nested Demo robots is a subpath artifact; origin-root crawler robots policy is controlled by the Pages deployment, not claimed here.

## Security, docs, architecture, regression

**PASS for the reviewed local boundary.** The source/ENV/artifact scans, safe URL constraints, escaped XML/JSON-LD, Markdown sanitizing pipeline, conditional third-party assets, and Recent Comments malicious-provider mocks did not reveal P0 exposure or a new unsafe execution path. The CDN client files are third-party code and remain an external trust/availability dependency; no live comment records, login, or backend mutation were exercised. Root YAML and parser modules are not shipped as browser configuration loaders. README, CHANGELOG, MIGRATION, EN/ZH Getting Started/config/integration/upgrade pages and the provider/schema matrices match the accepted Gitalk classification and staged feed paths. Version/tag and frozen Astro/static architecture remain intact. The changed Pages mobile-link assertion follows the now-configurable Demo menu's local `/links/` route; it is not a weakened external-link assertion.

At 1440, 1280, 1024, 768, 390, and 375px, config fixture home/search/preflight pages showed no document-wide horizontal overflow; the no-JS home had readable content/profile/footer. Existing RC no-JS article and Pages Demo no-JS tests passed. The preflight harness is a minimal provider mock page (not the full site footer); it is not evidence of pixel-perfect provider UI on mobile.

## Commands and results

- `pnpm install --frozen-lockfile`: pass (pnpm 11.25.0, Node 26.9.0).
- `pnpm check`; `pnpm test` (including config/comments/feeds); `pnpm build`; `pnpm test:i18n`; `pnpm test:readme`: pass after fix. `pnpm test:docs`: pass, 15 EN + 15 ZH Markdown pages.
- `pnpm run test:browser`: **7/7 root** and **7/7 `/aurora/`** passed, including search, theme, mobile and no-JS.
- `pnpm run test:browser:preflight`: **3/3** passed after fix with `site.language: zh-CN`, provider mocks, error state, malicious recent payload, and real English `/search/` result.
- `pnpm demo:build`; `pnpm test:demo`; Demo `pnpm test:preflight:feeds`; `pnpm docs:build`; `pnpm pages:build`; `pnpm test:pages`: pass. `PLAYWRIGHT_PAGES=true pnpm run test:browser:pages`: **5/5** passed.
- `ASTRO_SITE=https://example.com ASTRO_BASE={/,/aurora/,/blog/theme/} pnpm build`, followed by feed and route checks at each base: pass. XML negative control threw `InvalidTag` as expected. `git diff --check`: pass.
- An earlier `pnpm test:i18n` run immediately after `pnpm demo:build` failed because that script asserts ordinary fixture routes and `dist` was still Demo. Rebuilt ordinary `dist`, reran successfully, and used correct artifact order thereafter. This was a test-order mistake, not a code regression.

## Severity and verdict

- **P0 open: none.**
- **P1 open: none.** The route-locale issue above was reproduced, fixed and regression-tested.
- **P2 open: none requiring a merge block.** Ordinary positive RSS was exercised as a temporary adversarial build rather than a permanent ordinary-fixture test; Demo's positive feeds are covered by the committed gate.
- **P3 open: none identified.**

**APPROVE FOR MERGE.** This means PR #6 may be merged after its updated CI completes; it does **not** authorize stable publication. Keep the PR OPEN/NOT MERGED until the separate merge action. After merge, wait for `main` validation and Pages deployment, perform a narrow live config/feed/sitemap/robots smoke, and only then run a separate Aurora 3 Stable Release Gate. Production Waline/Twikoo/Valine services and historical comment continuity remain **NOT EXTERNALLY VERIFIED**.

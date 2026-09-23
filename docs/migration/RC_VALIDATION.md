# Aurora 3.0 RC validation

**Validation date:** 2026-09-19
**Scope:** static RC behavior, legacy-shaped migration compatibility, browser interaction, and deployment base paths.

## RC status

**RC VALIDATED for the repository/static release gate.**

The upstream Aurora theme/plugin repositories contain implementation code but no production blog corpus or provider records. The repository therefore validates the migration contract with legacy-shaped fixtures and source-level evidence. Production continuity for the bundled Valine, Twikoo, and Waline clients remains **not production-verified: external credentials and provider records required**. Gitalk has no Aurora 3 runtime, so backend verification is not applicable; compare its preserved UID/pathname mapping against historical records when migrating.

## Legacy content and identity

The available fixtures cover legacy frontmatter normalization, scalar/array tags and categories, custom permalinks, explicit and generated UIDs, dates, excerpts, feature/pin ordering, Markdown tables, blockquotes, raw HTML, images, internal/external links, code fences, and Unicode content. The upstream legacy source was inspected directly; no real user article corpus was available to copy without inventing production data.

The legacy UID evidence is the upstream helper:

```js
crypto.createHash('md5').update(str).digest('hex')
```

For posts, `str` is exactly `post_uid___${post.title}`. Aurora 3.0 preserves the title byte sequence: it does not trim, collapse whitespace, or normalize Unicode before hashing. The executable fixture covers repeated/leading/trailing whitespace, tabs, LF/CRLF, CJK, emoji, NFC/NFD combining characters, and punctuation-heavy titles. `scripts/verify-rc.mjs` compares every fixture against Node's MD5 implementation and the normalized content identity.

## Comment identity

| Provider | Aurora 3.0 identity policy | Local verification | Production status |
|---|---|---|---|
| Gitalk | Preserved legacy UID by default; pathname mode is explicit and aliases are emitted | Unit/manifest assertions | NOT APPLICABLE — identity/migration compatibility only; no runtime is bundled |
| Valine | Historical pathname without trailing slash | Unit assertions | Not production-verified: external records/credentials required |
| Twikoo | Historical pathname with trailing slash | Unit assertions | Not production-verified: external records/credentials required |
| Waline | Historical pathname with trailing slash | Unit assertions | Not production-verified: external records/credentials required |

The browser test verifies the comment route manifest without submitting a comment. Gitalk is retained only for identity and migration compatibility: upstream Gitalk 1.8 requires a browser-visible client secret, which Aurora 3 intentionally does not expose, and no OAuth/proxy runtime is built. This accepted limitation is not a Stable Preflight blocker. See `docs/migration/BLOCKERS.md` and ADR 005.

## Browser validation

`pnpm run test:browser` uses the project-local `@playwright/test` dependency and installed Chromium. The suite covers:

- home, article, taxonomy, archive, ordinary navigation, article HTML, table, code metadata, and JSON-LD;
- Pagefind queries `Aurora`, `迁移`, `中文`, `architecture`, `migration`, and `Aurora 迁移`, including result navigation;
- code copy, lightbox open/close, mobile menu, Escape close, theme toggle and persisted theme;
- route-manifest comment identity;
- JavaScript-disabled home, article, tags, categories, and archives.

Pagination boundary behavior (empty collection, clamped page/page-size, and a second-page slice) is covered by `scripts/verify-rc.mjs`. The four-post RC corpus does not generate a public page 2, so no page-2 browser click is claimed.

The root browser suite passed **5/5**. The same suite passed **5/5** under `/aurora/` using a test-only static mount that models a host serving `dist` below that prefix. The mount server is not part of the production site architecture.

Pagefind now reads its generated language manifest and merges non-primary language indexes. This is required because Pagefind otherwise selects the index matching the document's `lang` (`en`) and silently misses Chinese-only content.

## Build and base paths

| Build/behavior | Result |
|---|---|
| Root `ASTRO_BASE=/` build + Pagefind | Passed |
| `ASTRO_BASE=/aurora/` build + Pagefind | Passed |
| `ASTRO_BASE=/blog/theme/` build + Pagefind | Passed |
| Root browser smoke | Passed 5/5 |
| `/aurora/` browser smoke | Passed 5/5 |

Generated HTML and browser requests were checked for base-prefixed CSS, island bundles, Pagefind assets, canonical URLs, image links, and result URLs.

## Visual parity

The legacy runtime/content preview is unavailable, so an old-vs-new pixel comparison could not be made: **Legacy runtime unavailable; source-based parity review only.** The current RC was nevertheless rendered and screenshotted for home, article/code, Unicode article/image, tags, categories, archives, and search at 1440x900, 1280x800, 768x1024, 390x844, and 375x812. Review focused on header/navigation, cards, typography, article width and line-height, code blocks, images, blockquotes, pagination, footer, Chinese/emoji text, and mobile overflow.

The browser pass found two RC interaction regressions and fixed them:

1. Pagefind searched only the English index on an English shell page; multilingual index merging now returns Chinese and mixed-language matches.
2. Code-copy and lightbox islands were mounted after the article body and could miss visible content; they now hydrate before the static article body with the same small island scope.

Persisted theme preference, static `en`/`zh-CN` labels, mobile Escape/outside-click handling, Shiki fence title/highlight metadata, JSON-LD escaping, Unicode rendering, and route collision checks are covered by the fixture and browser/build assertions.

## Verification commands

Using the bundled workspace Node runtime (the interactive shell does not expose `node` directly):

```text
pnpm test
pnpm run check
pnpm run build
ASTRO_SITE=https://example.com ASTRO_BASE=/aurora/ pnpm run build
ASTRO_SITE=https://example.com ASTRO_BASE=/blog/theme/ pnpm run build
PLAYWRIGHT_BASE_PATH= pnpm run test:browser
PLAYWRIGHT_BASE_PATH=/aurora pnpm run test:browser
git diff --check
```

## Remaining backlog

- Verify provider-side comment keys against a real migrated site for representative posts; do not claim this from local fixtures.
- Run a true screenshot comparison when the legacy site/runtime and its content corpus are available.
- Consider author routes only if a real migration corpus demonstrates that they are public compatibility URLs.
- Expand fence metadata and image responsive-source coverage against real legacy posts.

## Architecture regression check

The RC preserves the frozen architecture: Astro owns static routing and article HTML; there is no SPA router; Vue remains limited to focused islands; one Astro Markdown/Remark/Rehype/Shiki pipeline is used; Pagefind remains the static search backend; `site`/`base` URL composition is centralized; and legacy URL, UID, and comment identity aliases remain build-time data.

# Aurora 3.0 — Independent giscus / Gitalk delta review

## Verdict and scope

**APPROVE FOR MERGE.** P0 and P1: none. Two P2 findings were reproduced and fixed; no findings remain open. This approves the reviewed PR #6 implementation for merge, not a Stable release. PR #6 must remain OPEN / NOT MERGED during this review.

Review date: 2026-09-24. Scope: Gitalk removal, giscus integration and migration, credentials/XSS/messages, mapping/base/locale/theme, shared provider regressions, configuration, feeds, and the combined Pages artifact. This is an independent delta review, not a repeat of unrelated visual parity work. No merge, release, version change, tag movement, OAuth backend, provider expansion, or history rewrite occurred.

## Reviewed baseline and head

| Identity | Verified value |
| --- | --- |
| Repository / PR | `yanpuzhen/astro-theme-aurora`, PR #6, `dev → main` |
| Remote main / PR base | `28725111385f36b3b9b3bf424cb8afe5b271e25c` |
| Previous Astra review boundary | `440ad6081d8ec3191fbf6d8d4bc3e6ea6bd50879` |
| Incoming remote dev / PR head | `056cc919706be00d5b53b8f9d591a12088f2f1fd` |
| Reviewed implementation after fixes | `18761ea9ff90a4e21384148795c4a3354cfc20d2` |
| RC2 tag target | `b0e2d10d16a83c487c112d3a030acbe6d47d9a60` — unchanged |
| Package version | `3.0.0-rc.2` — unchanged |

The commit containing this report is an evidence-only descendant of the reviewed implementation above. Its only tracked change is this document; the final PR head can be identified by that commit without pretending a file can contain its own commit SHA. Approval covers that report-only descendant as well.

The initial checkout was clean `dev`. I ran `git status`, `git branch -vv`, `git remote -v`, `git fetch --all --tags --prune`, the 80-commit graph, tag listing/resolution, and `gh pr view 6`; PR #6 was OPEN, MERGEABLE, and unmerged. I read the focused three-commit delta (41 files), including full-tree consumers. The earlier `ASTRA_STABLE_PREFLIGHT_REVIEW.md` is unchanged from `440ad608`; it records the earlier implementation and does not approve giscus retroactively.

## Findings and Astra fix

### P0

None.

### P1

None.

### P2 — both resolved

1. **Shared comment markup produced a hydration mismatch.** On the incoming head, real giscus article pages emitted `Hydration completed but contains mismatches.` The development build pinpointed a text-versus-`p` mismatch in `CommentIsland`: browsers parse the children of `<noscript>` as raw text when scripting is enabled, but Vue expected an element. This markup predates the delta and is inherited by the newly supported giscus path. The focused integration fix uses text-only `<noscript class="comment-status">` at `src/islands/CommentIsland.vue:98`. The fallback remains visible without JS. Existing tests watched `pageerror` only; the enhanced giscus and successful provider-mock tests also reject `console.error`. Final independent probes have zero console/page errors.
2. **Theme documentation implied a normal System-mode selection.** `_config.yml` and both integration guides said auto follows Light/Dark/System without explaining that normal Aurora pages always resolve `html[data-theme]` from URL override, saved visitor choice, then `theme.dark_mode`. No saved choice is not equivalent to System mode. Documentation now describes the actual contract: giscus follows the resolved site theme and uses the OS preference only when that attribute is absent. The established site-wide theme policy is preserved. Browser tests prove the configured default, absent-attribute OS light/dark fallback, and saved override under an opposite OS preference.

Both fixes and regression assertions are in `18761ea9ff90a4e21384148795c4a3354cfc20d2` — `fix(comments): eliminate hydration mismatch and clarify theme fallback`.

### P3

None.

## Gitalk removal and historical identity

All tracked matches for `gitalk`, `Gitalk`, `GITALK`, script names, public ENV names, secret keys, and the OAuth token endpoint were inspected. Classification:

| Location / occurrence class | Classification and result |
| --- | --- |
| Runtime types, comment component, adapters | No Gitalk provider, constructor, loader, CSS, unreachable branch, or capability entry |
| Canonical schema, root config, `.env.example` | No supported Gitalk fields or variables; `comments.gitalk` is rejected as an unknown key |
| `src/lib/config-loader.ts` | Migration-only detection/discard, obsolete ENV warning, and explicit stale-provider rejection; no reactivation |
| `src/lib/migration/gitalk.ts` | Migration-only UID/pathname comparison helper; imported by verification scripts, never by an active runtime consumer |
| `scripts/verify-{config,comments,rc}.mjs`, browser assertions | Test fixtures and removal/identity assertions |
| README, current migration/integration docs, capability/config matrices | Current removal/migration guidance, not active-runtime claims |
| Older migration/ADR/release/review documents and earlier changelog entries | Historical documentation; superseding notes preserve the original review boundary |
| `visual-reference/upstream/source/**` | Historical Aurora 2 source snapshots, including old constructors/secret keys; not imported into production |
| Generated ordinary/Demo executable assets | Gitalk runtime, ENV fields, and OAuth token endpoint absent |
| Generated Docs prose | Migration/removal explanations are expected; not executable Gitalk runtime |

Stale YAML and ENV provider selection deliberately fail with EN/ZH guidance explaining removal, the browser-secret boundary, giscus migration, and Waline/Twikoo/Valine alternatives. Presence of a legacy root `gitalk` section produces a value-free warning and defaults to `none` unless another valid provider is chosen. The migration identity utility has no secret handling, network requests, or runtime provider-union role.

## Gitalk secret security

**PASS.** Independent probes used `ASTRA_GITALK_SECRET_SENTINEL_7E31F1` in legacy `clientSecret`, canonical stale config, malformed sections, and obsolete public/private Gitalk ENV settings. The committed config suite additionally covers malformed YAML and `client_secret`. Normalized objects, warnings, rejection messages, stdout/stderr, and generated HTML/JS were checked. Valid legacy input builds successfully after discarding the section; canonical stale input fails safely. YAML syntax errors omit source excerpts.

Two actual sentinel builds, including after the fix, combined the legacy root section with `PUBLIC_GITALK_CLIENT_SECRET`. No sentinel value appeared in build logs, `dist`, or `.pages-dist`. No active secret field, site OAuth secret, or PAT is accepted by the giscus schema. Public repository/category IDs are identifiers, not credentials. The upstream visitor-session machinery is expected library code, not an embedded site-owned token.

## giscus upstream and dependency verification

Fresh read-only inspection confirmed both repositories are official, active projects under the giscus organization:

- [giscus](https://github.com/giscus/giscus), inspected at `3d6430237108ca4ee3eb6a1a20595201c09c72d5`: README, migration guidance, widget request handling.
- [giscus-component](https://github.com/giscus/giscus-component), inspected at `385018d8afc661254071cd3fb06ca825eb88625c`: README, Vue wrapper, web component, and API types.
- npm metadata reports **`@giscus/vue@3.1.1`** as current, with the official repository and Vue `>=3.2.0` peer support. Aurora pins exactly `3.1.1`; frozen install succeeds. The lock resolves `giscus@1.6.0`, Vue `3.5.43`, and Lit dependencies. Installed component code was inspected as well as current upstream source.

The official Vue wrapper imports the official web component on mount. The six mapping names match upstream exactly. No Octokit, GraphQL client, PAT library, or OAuth server dependency was introduced. Vue remains limited to Astro islands, with no second global app, SPA/router, runtime article API, or generic plugin framework.

## Config schema and API

| Field | Verified behavior |
| --- | --- |
| `repo` | Required GitHub owner/repository shape when selected; ordinary punctuation and a 39-character owner accepted; URLs/scripts rejected |
| `repo_id` | Required nonempty opaque public ID |
| `category` | Optional public search-category string; transported as data, including adversarial characters |
| `category_id` | Required for mappings that may create a discussion; optional for a fixed discussion number |
| `mapping` | `pathname`, `url`, `title`, `og:title`, `specific`, `number` only |
| `term` | Bounded string; nonempty for specific; positive integer string for number |
| `strict`, `reactions_enabled`, `emit_metadata` | Strict YAML booleans, forwarded as official `0`/`1` props |
| `input_position` | `top` / `bottom` |
| `theme` | `auto`, `light`, `dark`, `dark_dimmed`; arbitrary CSS URLs rejected |
| `lang` | `auto`, `en`, `zh-CN`; supported official locales |
| `loading` | `eager` / `lazy`; eager default complements `client:visible` |

Missing required fields, unsupported mapping/language/theme/options, invalid repo URLs, and user-supplied `host` fail validation. Schema, normalization, component props, root example, Docs, and matrices agree. Provider selection is unambiguous for giscus/Waline/Twikoo/Valine/none; Gitalk fails. ENV precedence and the strict existing YAML behavior remain intact. `none` stays the safe default; no real giscus repository is required for a normal build.

## Mapping and base-path behavior

Actual requests from the installed official web component were intercepted locally and their iframe URL parameters inspected, not inferred from Aurora's `data-comment-id` marker. Upstream pathname mapping removes the leading slash, strips a final filename extension, and uses `index` for `/`; it does not remove the deployment base.

| Configured base | English article's actual giscus term |
| --- | --- |
| `/` | `post/architecture-smoke/` |
| `/aurora/` | `aurora/post/architecture-smoke/` |
| `/blog/theme/` | `blog/theme/post/architecture-smoke/` |
| `/astro-theme-aurora/demo/` | `astro-theme-aurora/demo/post/architecture-smoke/` |

At each base, `/cn/post/legacy-compatibility/` retains the `cn/` segment and the custom permalink `/cn/legacy/custom-route/` uses that actual path. Legacy aliases can therefore map differently from canonical paths under upstream pathname semantics. The configured-base probe at the Demo URL uses ordinary fixtures intentionally; the real Demo overlay independently disables comments and keeps local Recent Comments fixtures. Root/index and nested base-root terms were also exercised on the installed component.

`specific` with the exact literal `{legacyUid}` uses the page's resolved comment identity: `0fa9cf4c8011836c59eb9810868fccf6` for the English fixture and `legacy-fixture-uid-001:zh-CN` for the Chinese fixture. This respects existing explicit comment-ID overrides and locale scoping. The custom alias and canonical route share that deliberate identity. No other placeholder, interpolation, or expression is evaluated. A literal specific term is global; `number` sends `number=42` and an empty search term for every page. Both shared-thread consequences are documented.

Migration docs correctly distinguish Gitalk Issues from giscus Discussions, require backups and representative conversion/mapping checks, and do not promise automatic continuity. They warn that base, locale, and permalink changes affect pathname mapping. `{legacyUid}` is useful only when converted Discussion titles/search mapping actually match; giscus does not understand old Gitalk labels automatically.

## Locale, theme, hydration, and failure behavior

**PASS.** EN and Chinese routes send `/en/widget` and `/zh-CN/widget`; an explicit `zh-CN` override on an English page was verified. Light → Dark → Light reaches the existing iframe via upstream `setConfig` messages. Tests preserve an instance marker and assert one widget and one iframe, so changing only the outer container would not pass.

System light/dark passes **as the absent-`data-theme` fallback**. On normal pages with no saved choice, Aurora's configured default wins; this is now accurately documented. A saved light override stays light under a dark system preference and survives reload. The observer, media listener, message listener, and timeout are cleaned up on unmount. Full locale navigation loads a new static page; the architecture has no SPA locale rerender contract.

Aurora's message listener accepts only `https://giscus.app` and that widget's iframe `contentWindow`, validates the used payload fields, and never inserts provider HTML. The upstream component targets its configured official origin for messages. Aurora exposes no arbitrary host/script/CSS URL. A controlled wrong-origin message does not alter status.

An unavailable iframe yields a localized status after 15 seconds; article content remains available. The enhanced Chinese test holds the iframe response, advances time past the timeout, then releases a valid resize message: status clears and exactly one iframe remains. This demonstrates recovery rather than an infinite spinner or remount loop. No-JS articles, navigation, and the comment fallback remain readable. Heading/status semantics are sensible.

The adversarial term `"><img src=x onerror=alert(1)> 中文 & {notAnExpression}` and a malicious-looking category survive as literal component/URL data. No injected HTML, dialog, page error, or script execution occurred. Both ordinary eager and explicitly configured lazy loading were exercised.

## Existing providers, configuration, feeds, and Pages

| Area | Result |
| --- | --- |
| giscus / Waline / Twikoo | FIRST-CLASS runtime; local integration PASS |
| Valine | LEGACY RUNTIME; identity/init/theme mock PASS |
| Gitalk | REMOVED |
| none | PASS; no comment section/widget/provider network load on an article |
| Recent Comments | Waline/Twikoo public APIs still normalize safe text, links, and avatars; giscus has no fabricated provider-backed comments or count service |
| Sidebar / Demo | Honest unavailable state for giscus; deterministic local Demo fixtures remain isolated |
| `_config.yml`, Zod, ENV | PASS; defaults, strict errors, precedence, legacy aliases, and safe public props retained |
| `site.language: zh-CN` | Unprefixed search remains EN with a real English result; `/cn/search/` returns Chinese results in the same config build |
| Ordinary feeds | Valid EN/ZH RSS, 0 fixture items by design, 31 canonical sitemap URLs, correct robots target |
| Demo feeds | 13 EN + 13 ZH RSS items, 100 canonical sitemap URLs, correct robots target |
| Pages | Docs at `/astro-theme-aurora/`, Demo at `/astro-theme-aurora/demo/`; RSS/ZH RSS/sitemap/robots present and checked |
| Earlier Pages route assertion | Still uses configured Demo `/links/`; unchanged by this delta |

No ordinary HTML contains the test repo/category IDs or preflight markers. Giscus code is emitted as a client chunk, but the official web component is imported on giscus mount; `none` does not fetch provider code or iframe resources. Small shared wrapper code with other enabled comment providers is not a global widget load.

## Generated scans

Final ordinary `dist`: **153 files**. Final combined `.pages-dist`: **447 files**. Scans found zero sentinel values, Gitalk executable signatures, `PUBLIC_GITALK_` names, OAuth-token endpoint strings, GitHub token-shaped values, or private-key material. The provider gate additionally checks secret-assignment signatures in ordinary/Demo HTML and JS. Docs migration prose was classified separately from executable runtime. `GISCUS_REPLACEMENT_IMPLEMENTATION.md`, the provider/config matrices, README, migration docs, and bilingual integration docs were checked against code and generated artifacts.

## Commands and actual results

All source edits followed the read-only review and baseline validation. Commands below are the validation commands actually executed; repeated builds were ordered deliberately because `dist` is overwritten. Pages staging preserves its own Demo copy and restores ordinary `dist`.

| Command / invocation | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | PASS; Node 26.9.0, pnpm 11.25.0 |
| `pnpm check` | PASS before/after; 87 files, 0 errors/warnings/hints |
| `pnpm test:preflight:config` | PASS; stale selection, schema, precedence, secrets |
| `pnpm test:preflight:comments` | PASS; provider/identity/recent/generated checks |
| `node --experimental-strip-types /tmp/aurora-giscus-review/config-probe.mjs` | PASS independent negative/positive schema and sentinel probes |
| `pnpm test` | PASS before/after; includes pretest build and build/RC/config/comments/feed gates |
| `pnpm build` | PASS; final ordinary output restored after sentinel build |
| `pnpm run test:browser` | PASS; root 7/7 before and after |
| `ASTRO_BASE=/aurora/ PLAYWRIGHT_BASE_PATH=/aurora pnpm run test:browser` | PASS; nested build and 7/7 RC tests |
| `ASTRO_BASE=/blog/theme/ pnpm build` | PASS |
| `PLAYWRIGHT_BASE_PATH=/blog/theme pnpm exec playwright test tests/browser/rc.spec.ts` | PASS; 7/7 |
| `ASTRO_SITE=https://example.com ASTRO_BASE=/ pnpm build` | PASS |
| `pnpm test:preflight:feeds` with root, `/aurora/`, `/blog/theme/` matching build environment | PASS at all three bases |
| `pnpm test:browser:giscus` | Incoming tests 3/3; fixed implementation/new tests finally 5/5 via direct invocation below |
| `PLAYWRIGHT_BASE_PATH=/giscus-smoke ASTRO_CONFIG_FILE=tests/fixtures/config-giscus.yml pnpm exec playwright test tests/browser/giscus.spec.ts` | Final enhanced suite 5/5 |
| `pnpm test:browser:preflight` | PASS before/after; 5/5, including controlled unavailable-provider cases |
| `PLAYWRIGHT_BASE_PATH=/config-smoke pnpm exec playwright test tests/browser/rc.spec.ts -g 'Chinese Pagefind'` | PASS; 1/1 with `site.language: zh-CN` fixture |
| `ASTRO_CONFIG_FILE=tests/fixtures/config-giscus.yml ASTRO_BASE=<base> pnpm build` for `/`, `/aurora/`, `/blog/theme/`, `/astro-theme-aurora/demo/` | PASS before/after |
| `ASTRO_BASE=<base> node /tmp/aurora-giscus-review/browser.mjs` for those four bases | Final PASS; 3 real routes each, exact iframe parameters and responsive/theme checks |
| `ASTRO_CONFIG_FILE=/tmp/aurora-giscus-review/<mode>.yml ASTRO_BASE=/ pnpm build` for `specific`, `number`, `unsafe` | PASS before/after |
| `PROBE_MODE=<mode> node /tmp/aurora-giscus-review/browser.mjs` for those three modes | Final PASS; 3 routes each, IDs/numbers/XSS/explicit locale/options |
| `ASTRO_CONFIG_FILE=/tmp/aurora-giscus-review/sentinel.yml PUBLIC_GITALK_CLIENT_SECRET=<sentinel> pnpm build` | PASS before/after; output and logs have no sentinel |
| `pnpm demo:build`; `pnpm test:demo` | PASS before/after |
| `ASTRO_SITE=https://yanpuzhen.github.io ASTRO_BASE=/astro-theme-aurora/demo/ FEED_EXPECT_MODE=demo pnpm test:preflight:feeds` | PASS; 13 EN / 13 ZH items, 100 sitemap URLs |
| `pnpm docs:build`; `pnpm test:docs` | PASS before/after; 15 EN + 15 ZH Markdown pages |
| `pnpm test:i18n`; `pnpm test:readme` | PASS before/after |
| `pnpm pages:build`; `pnpm test:pages` | PASS before/after |
| `PLAYWRIGHT_PAGES=true pnpm run test:browser:pages` and final `pnpm run test:browser:pages` (script sets the same flag) | PASS; 5/5 each |
| `python3 /tmp/aurora-giscus-review/final-validation.py` | PASS; recorded serial build/probe/full-gate orchestration |
| Generated-tree Python scans; `git diff --check` | PASS |

Diagnostic failures were not hidden: the initial ad hoc custom route lacked `/cn/` and was corrected from the route manifest; subsequent independent probes exposed the real hydration defect. After the fix, one new no-JS text assertion failed because Playwright intentionally excludes `noscript` from its text matcher, and a Chinese timeout assertion used the wrong translated phrase. Both test assertions were corrected, then all five giscus tests passed. These were test-harness errors, separate from the product hydration finding. The temporary development-server run provided Vue's detailed mismatch location and was stopped afterward.

Local scripts, logs, parameter records, scan summaries, and protocol-fixture screenshots are preserved under ignored `output/playwright/astra-giscus-review/`. Upstream checkout SHAs are recorded above; those third-party source trees are not added to Aurora.

## Browser, responsive, no-JS, and console summary

- RC: root **7/7**, `/aurora/` **7/7**, `/blog/theme/` **7/7**.
- Configured giscus: **5/5** final; provider preflight: **5/5**; Pages: **5/5**; extra Chinese config search: **1/1**.
- Independent giscus matrix: **7 configurations × 3 routes = 21 route observations**, all final runs with zero console/page errors. Tests inspect official-component iframe requests and delivered configuration, not a substitute fake component.
- Widths **1440, 1024, 768, 390, 375**: PASS for document overflow and iframe bounds. Local fixture screenshots inspected; no claim of production backend pixel parity.
- No-JS: PASS for ordinary, configured comments, and Pages Demo. Comment heading/status/fallback remains understandable.
- Console: no unexpected errors after the fix. Deliberately aborted assets in failure tests may generate browser network diagnostics; those are controlled failures, not silent application errors.

## External evidence limitations and next step

**CLIENT INTEGRATION VERIFIED.** **LIVE GISCUS DISCUSSION BACKEND NOT EXTERNALLY VERIFIED.** No production repo/App/Discussion setup or converted historical records was supplied. No test created Discussions, converted Issues, posted comments, installed Apps, or changed a provider backend. Live Waline/Twikoo/Valine services and old-record continuity also remain unverified. Mocked iframe layout/protocol evidence does not establish the production service's availability or its full UI rendering.

PR #6 is ready for the separate merge action after its current-head checks. Keep it OPEN / NOT MERGED here. Stable release is NOT STARTED. After merge: wait for main validation and Pages deployment, perform narrow production smoke for Demo, EN/ZH RSS, sitemap, robots, EN/ZH search and Gitalk asset absence, then begin the dedicated Aurora 3.0 Stable Release Gate.

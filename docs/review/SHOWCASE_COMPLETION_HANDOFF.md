# Aurora 3.0 Showcase Completion Handoff

Date: 2026-09-22  
Branch: `dev`  
Release boundary: post-RC2 development; `v3.0.0-rc.2` remains immutable at `b0e2d10`.

## Status

READY FOR ASTRA REVIEW

The Showcase pass is implemented with the frozen Astro/static architecture.
Astro still owns content, routes, taxonomy, pagination, SEO, RSS, sitemap, and
static Markdown HTML. Vue remains limited to focused islands.

## Placeholder audit

The initial audit is recorded in
[`SHOWCASE_COMPLETION_AUDIT.md`](./SHOWCASE_COMPLETION_AUDIT.md). Public Demo
empty shells were replaced with real deterministic fixtures where the feature
supports populated data. Theme-level empty states remain for unconfigured
ordinary sites.

Remaining keyword matches are intentional:

- `aurora-placeholder.svg` appears only in legacy compatibility fixtures and
  their build assertions; `verify-demo` rejects it from Demo output.
- Search `placeholder` is the native input attribute and localized UI key.
- `no-data`/fallback language documents the provider-safe empty behavior.
- The audit and review docs describe the initial findings and their resolution.

No visibly unfinished public Demo section remains in the generated artifact.

## Demo content

The Demo contains exactly ten primary Showcase posts: five English/Chinese
translation pairs sharing these keys:

| Pair | English | Chinese | Translation key | Public routes |
| --- | --- | --- | --- | --- |
| 1 | Markdown Fundamentals in Aurora | Aurora Markdown 基础语法测试 | `demo-markdown-fundamentals` | `/post/demo-markdown-fundamentals/`, `/cn/post/demo-markdown-fundamentals/` |
| 2 | Code, Syntax Highlighting and Developer Notes | 代码高亮与技术文档测试 | `demo-code-showcase` | `/post/demo-code-showcase/`, `/cn/post/demo-code-showcase/` |
| 3 | Tables, Lists, Quotes and Rich Documents | 表格、列表、引用与复杂文档 | `demo-rich-markdown` | `/post/demo-rich-markdown/`, `/cn/post/demo-rich-markdown/` |
| 4 | Mathematics and Scientific Writing | 数学公式与科学写作测试 | `demo-math` | `/post/demo-math/`, `/cn/post/demo-math/` |
| 5 | Images, Media and Aurora Features | 图片、媒体与 Aurora 功能测试 | `demo-media` | `/post/demo-media/`, `/cn/post/demo-media/` |

Sixteen additional `demo: true` archive fixtures (eight per locale, 2019–2026)
make archive timelines and page 2 meaningful without changing the primary-post
count. Primary covers use deterministic seeded Picsum URLs and are emitted as
remote URLs; builds never download cover bytes.

## Markdown and Math

- CommonMark and Shiki remain in the single Astro Markdown pipeline.
- `remark-gfm` covers tables, alignment, task lists, strikethrough, and GFM
  autolinks.
- `remark-math` plus `rehype-katex` renders inline/display equations at build
  time, including fractions, roots, sums, integrals, Greek symbols, indices,
  matrices, and aligned equations.
- Long display equations scroll within their own container. KaTeX MathML is
  retained for accessibility and clipped by KaTeX CSS; raw LaTeX is not shown.
- The exact fixture coverage is in
  [`MARKDOWN_DEMO_MATRIX.md`](./MARKDOWN_DEMO_MATRIX.md), with bilingual docs
  under `docs-site/en/configs/markdown.md` and `docs-site/cn/configs/markdown.md`.

## Populated surfaces

- Profile: derived post/category/tag counts, deterministic avatar, `Aurora Demo`
  identity, GitHub, Docs, and Issues links.
- Recent comments: three English and two Chinese local-only entries linking to
  real Demo articles; normal builds retain the localized provider-disabled
  fallback and never write to a comment provider.
- Friend Links: seven localized Demo Resources in Projects/Resources groups,
  exercising name, URL, avatar, description, category, and accent color.
- About: localized Astro migration, static architecture, i18n, Markdown,
  Pagefind, repository, docs, and attribution content.
- Home/taxonomy: featured and pinned badges, five categories, varied tags,
  archive years, page 2, and locale-isolated Pagefind indexes.
- 404: localized Aurora-styled page with home and search actions.

## Dia and Footer

Dia is a focused Vue island with the Aurora orb/body, two eyes, platform glow,
message bubble, breathing/blink/pulse/startup/hover behavior, delegated
`data-dia` reactions, English/Chinese messages, keyboard focus, mobile hiding,
and reduced-motion handling. Search and Lightbox layers are above Dia.

Footer now provides dynamic package version, copyright range, Astro/Aurora
attribution, optional ICP/police filing configuration, optional configured
statistics, calculated running days, responsive avatar behavior, and localized
labels. Demo-only counters and fixed start date are explicitly labeled
`Demo showcase data`; ordinary builds hide unavailable values. Footer copy has
desktop space reserved so Dia cannot cover attribution text.

## Isolation and compatibility

`ASTRO_DEMO_BUILD=true` selects only `demo: true` entries. Normal `pnpm build`
uses compatibility fixtures for route/identity regression but excludes Demo
posts, comments, links, profile identity, counters, and started-date values from
public Demo behavior. Legacy URLs, UIDs, comment identity modes, explicit
permalinks, `.html` aliases, and route manifests remain covered by the existing
RC tests.

## SEO, feeds, and search

Generated Showcase pages include canonical URLs, `en`/`zh-CN`/`x-default`
alternates, locale HTML metadata, localized OpenGraph values, base-safe links,
English and Chinese RSS feeds, sitemap entries, and two Pagefind language
indexes. Browser coverage checks English, Chinese, mixed/marker search, locale
isolation, and translation-pair navigation.

## Screenshots

`scripts/capture-visual.mjs` now targets Showcase routes rather than the removed
legacy article and captures 84 no-overflow fixtures:

`home`, `article`, `math`, `links`, `about`, `archives`, and a dedicated
`footer` viewport × six viewports (`1440`, `1280`, `1024`, `768`, `390`, `375`) ×
light/dark themes. Latest generated evidence is under the ignored
`output/playwright/showcase-visual/`. Tracked README previews were refreshed
from current Showcase captures in `previews/`.

## Verification

Passed on the bundled Node/pnpm runtime:

- `pnpm check`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`
- `pnpm test:demo`
- `pnpm docs:build`
- `pnpm pages:build`
- `pnpm test:pages`
- `pnpm test:docs`
- `pnpm test:i18n`
- `pnpm test:readme`
- `pnpm test:browser` — 7 passed, 5 Pages-only tests skipped
- `PLAYWRIGHT_PAGES=true pnpm test:browser:pages` — 5 passed, 7 standalone tests skipped
- `ASTRO_BASE=/aurora/ pnpm build`
- `ASTRO_BASE=/blog/theme/ pnpm build`
- `git diff --check`

Browser checks include no-JS readability, lightbox, code copy, mobile menu,
Pagefind, locale routing, Dia interaction/stacking, Footer fixture values,
Math/KaTeX output, mobile no-overflow, and `prefers-reduced-motion` animation
suppression.

## Security boundary

JSON-LD escapes `<`, `>`, and `&`; Markdown scripts are removed/inert; Dia
messages are text-only; external links are explicit public HTTPS destinations;
remote images are emitted as URLs and do not execute content. Provider secrets
and production comment databases are not part of the Demo fixture path.

## Verified remaining gaps

- Production comment-provider continuity still requires representative external
  records; no provider database was available for this local review.
- GitHub Pages repository settings and the post-merge live canonical paths
  require verification after an approved `dev → main` merge.
- Seeded remote image availability is third-party runtime state; build and
  layout do not depend on downloading those bytes, and the local fallback
  behavior remains intact.
- Pixel identity with upstream production photography, author data, and live
  provider records is not claimed.

## Commit and release handling

Implementation commits on `dev`:

- `6291c74` — `feat: complete Aurora Showcase surfaces`
- `5e51af7` — `docs: document Showcase completion and verification`
- `972e04f` — `docs: record Showcase commit handoff`
- `bda0819` — `docs: refresh Showcase routing examples`

An open `dev → main` pull request will follow. No merge, force-push, version
bump, RC3, stable release, or movement of `v3.0.0-rc.2` is part of this
handoff.

Next step: Astra performs the final focused review before any merge toward
stable.

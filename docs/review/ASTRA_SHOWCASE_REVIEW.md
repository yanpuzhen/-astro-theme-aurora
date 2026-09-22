# Scope

This is an independent stable-readiness review of PR #5 (`dev → main`) after
the Showcase implementation and the follow-up security/release-gate fix. The
review covers generated ordinary and Demo builds, source and configuration,
legacy route identity, the checked-in upstream reference, browser behavior, and
the Pages artifact. It does not merge the PR, publish stable, or move RC2.

# Baseline

- Repository: `yanpuzhen/astro-theme-aurora`
- PR: [#5](https://github.com/yanpuzhen/astro-theme-aurora/pull/5), **OPEN** and **NOT MERGED**
- Base: `main` at `b0e2d10d16a83c487c112d3a030acbe6d47d9a60`
- Reviewed head: `dev` at `6a759d0c795e027da03ee09868253e9509cc22ad` (`docs(review): record Astra showcase gate`)
- `origin/dev` before the local fix: `752749b42c417240e650603b34d48f80890318a4`
- `v3.0.0-rc.2` peeled commit: `b0e2d10d16a83c487c112d3a030acbe6d47d9a60` (unchanged)
- Working tree after verification: clean

# PR verification

GitHub PR metadata, branch ancestry, remote refs, the complete `origin/main...origin/dev`
diff, and the release tag were checked. The final local fix is committed on
`dev`; no merge, force push, tag movement, version bump, RC3, or stable release
was performed.

# Placeholder audit

Repository-wide keyword search found only compatibility fixtures, native input
attributes, intentional provider-disabled fallback text, source documentation,
and historical review text. `aurora-placeholder.svg` remains in legacy
compatibility fixtures and is rejected from Demo output. No public Demo HTML
contains compatibility titles, placeholder assets, fake controls, or empty
feature shells where deterministic fixtures are available.

# Demo content

**10 primary posts: PASS.** There are five English and five `zh-CN` posts with
the five required translation keys. Each pair has the expected locale route,
canonical, alternates, and locale switch. Sixteen dated archive fixtures are
separate from the primary Showcase set; home and archive page 2 are populated.

**Archive fixtures: PASS.** `ASTRO_DEMO_BUILD=true` selects Demo content
exclusively; ordinary builds select compatibility content exclusively.

# Markdown

- CommonMark: **PASS**
- GFM tables, alignment, task lists, strikethrough, and autolinks: **PASS**
- Shiki fences and Aurora fence metadata: **PASS**
- Footnotes: **Not claimed** and intentionally not configured
- Raw HTML policy: **PASS after c29afa9**. `rehypeRaw` is followed by a small
  security pass that removes executable tags, event-handler attributes, unsafe
  URL schemes, inline styles, and `srcdoc`; safe media/details HTML remains.

# Math

Build-time `remark-math → rehype-katex` is the sole math path. Inline, display,
fractions, roots, sums, integrals, Greek symbols, indices, matrices, and aligned
equations render in generated HTML. KaTeX MathML remains present for
accessibility, no-JS browser checks pass, and long displays scroll within their
own container at mobile widths.

# Profile

**PASS in Demo; isolated in ordinary builds.** Demo identity, avatar, bio,
socials, and derived word/article/category/tag counts are populated. Ordinary
builds use configured author data or the honest fallback and do not inherit Demo
identity or counters.

# Social

**PASS.** Demo links point to the repository, documentation, and issue tracker;
they use labeled keyboard-accessible anchors. User-configured social URLs are
now restricted to `http`, `https`, `mailto`, or `tel` schemes.

# Recent Comments

**UI: PASS.** Avatar, author, text, article link, and date are rendered in the
Aurora sidebar layout. **Demo fixture: PASS.** Entries are deterministic and
local-only. **Provider isolation: PASS.** Ordinary builds render the
provider-disabled fallback and no fixture is sent to Gitalk, Valine, Twikoo, or
Waline. Legacy comment identity tests remain green.

# Links

**EN: PASS. ZH: PASS. Fixture isolation: PASS.** Seven categorized Demo
Resources render with names, URLs, avatars, descriptions, accents, and mobile
layout. These are explicitly presented as project/resource links. Ordinary
builds render the configured empty state and no unsafe URL is introduced.

# About

**EN/ZH: PASS.** Both pages describe the implemented Astro static architecture,
Pagefind, i18n, Markdown, Math, repository, license, and migration boundary.

# Dia

- Visual parity: **PASS with content-level P2 differences**. The orb/body, two
  eyes, gradient platform, framed message bubble, Aurora palette, and stacking
  relationship are present and recognizable against the upstream component.
- Animations: **PASS** for startup reveal, breathing/jump, blink, platform pulse,
  hover reaction, and message motion.
- Context reactions: **PASS** through delegated `data-dia` hooks.
- i18n: **PASS** for English and Simplified Chinese messages.
- Desktop: **PASS** and visible in Demo.
- Mobile: **PASS**; hidden below the mobile breakpoint without overflow or
  interaction obstruction.
- Reduced motion: **PASS**; the browser suite observes `animation: none`.
- Accessibility: **PASS** for a labeled keyboard button, polite status output,
  and no focus trap.
- Security: **PASS**; messages are text-rendered and custom data is stripped of
  HTML before display.

# Footer

- Visual parity: **PASS with P2 pixel differences**; rule, grouped copy, links,
  statistics, running days, avatar, and responsive collapse are present.
- Version: **PASS**; derived from `package.json` (`3.0.0-rc.2`).
- Copyright/Astro/Aurora attribution: **PASS**; no Hexo attribution remains.
- Statistics: **PASS**; Demo counters are explicitly labeled and ordinary
  builds hide unavailable values.
- Running days: **PASS**; UTC date calculation clamps invalid negative values.
- Avatar: **PASS** for shape and responsive placement.
- 备案: **PASS** as optional configuration; invalid schemes are omitted and
  labels are localized.
- i18n and Dia overlap: **PASS** in generated Demo and browser layering checks.

# Search

English and Chinese Pagefind indexes, initial/loading/result/empty states, marker
queries, mixed query behavior, and locale isolation pass. Search, lightbox, and
mobile menu layers sit above Dia. The no-JS search-page fallback remains usable.

# i18n

Default English remains unprefixed; Chinese remains `/cn/`. Home, articles,
archives, tags, categories, links, about, search, RSS, sitemap, and 404 routes
are generated in both locales. `translationKey` is used only for pairing;
legacy UID, slug/permalink, and comment identity remain separate. HTML `lang`,
self-canonical, and locale alternates pass.

# SEO

Canonical, `hreflang` (`en`, `zh-CN`, `x-default`), localized OpenGraph values,
sitemap, RSS, nested base URLs, and static route manifests pass generated-output
assertions.

# RSS / Sitemap

Both locale feeds and the sitemap contain the appropriate ordinary or Demo
corpus for their build mode. Base-aware URLs and pagination entries are present.

# Fixture isolation

Ordinary `pnpm build` publishes compatibility fixtures only. Demo profile,
comments, links, counters, started date, and Showcase posts are absent from the
ordinary artifact. Demo output contains exactly ten primary translation-paired
posts and rejects compatibility markers and placeholder assets.

# Legacy compatibility

Legacy routes, explicit permalinks, `.html` aliases, UID hashes, route collision
checks, and Gitalk/Valine/Twikoo/Waline identity modes pass the existing RC
assertions and browser manifest checks.

# Architecture

**PASS.** Astro owns static routing, Content Collections, taxonomy, pagination,
SEO, RSS, sitemap, and the single Remark/Rehype/Shiki Markdown pipeline. Vue is
limited to focused islands. No SPA router, runtime article fetch, or duplicate
Markdown renderer was found.

# Security

**PASS for reviewed scope after c29afa9.** JSON-LD escapes `<`, `>`, and `&`;
Markdown raw HTML is sanitized; Dia messages are text-only; configured social
and filing links reject unsafe schemes; Demo links are HTTPS; no secrets,
OAuth credentials, comment-provider tokens, or private URLs were found.

# Accessibility

Skip links, labels, locale/theme/menu controls, keyboard Dia interaction,
lightbox close behavior, image alt text, KaTeX MathML, focusable links, and
reduced-motion behavior were reviewed. Static pages remain readable with
JavaScript disabled.

# Responsive

Browser no-overflow checks passed at 1440, 1280, 1024, 768, 390, and 375 pixels
for the tested Showcase surfaces. Mobile menu, article math, links, footer, and
Dia visibility were exercised. The tracked 84-image Showcase matrix remains in
`output/playwright/showcase-visual`; representative current previews were
inspected for Home, Math Article, Footer, and Mobile.

# Visual review

- Home: **PASS**
- Article: **PASS**
- Profile: **PASS**
- Recent Comments: **PASS**
- Links: **PASS**
- Dia: **PASS with P2 content/pixel differences**
- Footer: **PASS with P2 pixel differences**
- Mobile: **PASS**

# Tests

Passed with the bundled Node/pnpm runtime (Node `v24.19.0`, pnpm `11.19.0`):

- `pnpm install --frozen-lockfile`
- `pnpm check`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build` and `pnpm test:demo`
- `pnpm docs:build` and `pnpm test:docs`
- `pnpm pages:build` and `pnpm test:pages`
- `pnpm test:i18n`
- `pnpm test:readme`
- `pnpm test:browser` — 7 passed, 5 Pages-only tests skipped
- `PLAYWRIGHT_PAGES=true pnpm test:browser:pages` — 5 passed, 7 standalone tests skipped
- `ASTRO_BASE=/aurora/ pnpm build`
- `ASTRO_BASE=/blog/theme/ pnpm build`
- `git diff --check`

The Pages builder now stages Demo before restoring ordinary `dist`, so the
required i18n/readme checks can run after `pages:build` without sharing the
wrong corpus.

# P0

None.

# P1

None remaining after the raw-HTML security fix and isolation verification.

# P2

- GitHub Pages repository source settings and post-merge live canonical paths
  still require a live check after an approved merge.
- Remote Picsum availability is third-party runtime state; the build does not
  download those bytes and the layout remains stable when they fail.
- Demo copy, seeded photography, local icon equivalents, and some typography
  differ from upstream production pixels by design.
- Production provider continuity needs representative external comment records;
  no provider database was available in this local review.

# P3

Minor pixel-level typography and animation timing differences were not pursued.

# Merge recommendation

**APPROVE FOR MERGE.** P0 and P1 are empty; the public Demo is populated,
build-time Math and KaTeX accessibility work, Dia and Footer preserve the Aurora
structure, fixtures are isolated, i18n/SEO/Pagefind/legacy identity pass, and
the static architecture remains intact. This approval is a merge gate only; it
is not stable-release approval.

# Astra fixes

- `c29afa9` — `fix(review): harden showcase release gates`
  - Sanitized dangerous raw Markdown HTML and added generated-output assertions.
  - Restricted user-configured social/filing URL schemes.
  - Localized optional Footer filing labels.
  - Restored ordinary `dist` after Pages staging so the full command matrix is
    order-safe.

# Remaining gaps

Only the concrete P2 boundaries listed above remain. No unverified production
provider continuity, Pages setting, or third-party image availability is being
represented as a local success.

# RC2

`v3.0.0-rc.2` remains immutable at
`b0e2d10d16a83c487c112d3a030acbe6d47d9a60`; package version remains
`3.0.0-rc.2`.

# PR state

PR #5 is **OPEN — NOT MERGED**.

# Next step

Merge PR #5 only after the normal repository review process. After merge, run
GitHub Pages/live canonical smoke checks and a separate stable-release gate;
this review does not publish stable.

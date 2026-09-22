# Aurora 3 Showcase Completion Audit

Date: 2026-09-21  
Baseline: `dev` at `b0e2d10`; `v3.0.0-rc.2` peels to the same commit.

This is the pre-implementation audit for the post-RC2 showcase pass. A blank
state is not automatically a defect: theme-level fallbacks remain valid when
users have not configured a provider or dataset. The Demo, however, must use
deterministic fixtures wherever Aurora has a populated feature path.

| Area | Current state | Upstream equivalent | Classification | Work required |
| --- | --- | --- | --- | --- |
| Header/navigation | Static navigation, search, locale and theme controls are present | Header, Navigation, Controls | Real feature | Add Dia hooks and verify active/mobile states |
| Mobile navigation | Hydrated menu exists and receives the same menu data | Header responsive navigation | Real feature | Verify all public Demo routes and locale labels |
| Locale switcher | Static links are generated from the current route | Locale control | Real feature | Keep base-aware and pair-aware for showcase posts |
| Search | Pagefind island plus `/search/` fallback | Search page and modal | Real feature | Exercise English, Chinese and mixed corpus |
| Home Feature | Feature selection is populated only by current small corpus | Feature/FeatureList/ArticleCard | Demo fixture gap | Add five paired showcase groups and feature/pinned coverage |
| Profile | Derived counts exist, but author/avatar/social data fall back to Aurora/favicon | Sidebar Profile/Social | Demo fixture gap | Add explicit Demo identity and deterministic avatar/socials |
| Recent comments | Always renders a no-data shell | Sidebar RecentComment | Theme fallback is valid; Demo gap | Add Demo-only deterministic fixture entries and preserve provider-empty behavior |
| Tag box | Derived from posts and currently populated | TagBox | Real feature | Expand taxonomy and verify locale counts |
| Categories | Derived from posts and routeable | CategoryBox/Category page | Real feature | Populate five meaningful localized categories |
| Post detail | Static article HTML, cover, metadata, TOC and comments hook exist | Article/PostStats/Toc | Real feature with parity gaps | Add complete stats, richer content and regression assertions |
| Markdown | Remark/Shiki pipeline supports containers and fence metadata | Markdown renderer | Feature gap | Add GFM and build-time KaTeX without a second renderer |
| Code copy | Focused island on code-bearing posts | Code block enhancement | Real feature | Exercise all supported languages and metadata |
| Images/lightbox | Static images plus focused lightbox island | Article media/lightbox | Real feature | Add deterministic remote covers and multi-image Demo fixture |
| Archives | Timeline is populated but current page size prevents a meaningful second page | Archives | Demo fixture gap | Use ten posts across multiple dates and test pagination boundaries |
| Pagination | Component is functional but Demo corpus is too small for home page 2 | Pagination | Demo fixture gap | Verify page 1/page 2 with the archive corpus |
| About | English content is one sentence; Chinese route is hard-coded and thin | About/PageContent | Placeholder-like public surface | Replace with localized, complete showcase content |
| Friend Links | Gradient avatar wall and no-data message only | LinkBox/LinkList/LinkCategoryList | Theme fallback is valid; Demo gap | Add categorized Demo Resources and localized entries |
| 404 | Localized text/link shell exists | Aurora 404 illustration | Simplified visual port | Add Aurora-styled actions and visual identity without SPA dependency |
| Comments | Provider adapters preserve identity; disabled state renders nothing | Comment component | Real feature | Keep disabled fallback clean; never mix Demo fixtures into providers |
| Dia/Aurora Bot | Minimal star button and one message | `Dia.vue` plus `aurora-dia` messages/event behavior | Incomplete visual port | Restore character, platform, messages, reactions, locale and reduced motion |
| Footer | Copyright/links/attribution only; no version, stats, running days or avatar behavior | `FooterContainer.vue` | Incomplete visual port | Add configured stats, started date, version, optional备案 and i18n |
| RSS/sitemap/SEO | Static routes and metadata are implemented | Static generators | Real feature | Verify all ten pairs, hreflang and base-safe URLs |
| Demo isolation | `demo: true` is selected for Demo builds, but ordinary builds also include Demo posts | Existing `ASTRO_DEMO_BUILD` mechanism | Regression risk | Make Demo selection exclusive and keep normal builds free of Demo fixtures |
| Assets | Public Demo content references placeholder SVGs and local sample assets | Project-owned/upstream assets | Public asset gap | Replace primary showcase imagery with deterministic remote covers; retain only compatibility fixtures |
| i18n | Core labels are centralized, but About/Links and Dia are incomplete | Locale dictionaries | Feature gap | Extend centralized messages and localized fixtures |
| Documentation | Migration/release docs describe the RC2 no-data state | Existing docs site and review docs | Documentation gap | Add Markdown/Math/Dia/Footer/Links/Demo fixture guidance in both locales |

## Initial placeholder findings

The initial repository search found public no-data or temporary-looking surfaces
in `src/pages/links/index.astro`, the locale catch-all Links/About branches,
`src/components/Sidebar.astro`, and `src/islands/DiaIsland.vue`. It also found
compatibility-only references to `aurora-placeholder.svg` in legacy fixtures and
review documentation. Those compatibility references are not part of the
primary Demo once the fixture selector is isolated.

## Completion rule

Every remaining `placeholder`, `mock`, `stub`, `dummy`, `TODO`, `FIXME`,
`no-data`, `coming soon`, or `not implemented` occurrence must be test-only,
documentation of an intentional fallback, or an internal compatibility name.
The final handoff must report verified gaps separately from completed behavior.

## Post-implementation re-audit (2026-09-22)

The requested Showcase pass is implemented on the working `dev` tree. The
Demo now contains exactly ten primary bilingual Showcase posts (five
`translationKey` pairs) plus sixteen dated archive fixtures, all selected by
`demo: true`. GFM, build-time KaTeX, seeded remote covers, featured/pinned
cards, localized taxonomy, Profile/social data, recent-comment fixtures,
categorized Friend Links, About content, Dia, Footer statistics, running days,
and the 404 actions are exercised by generated output or browser assertions.

Normal builds retain only compatibility content and theme-level empty/provider
fallbacks. They do not receive Showcase posts, fixture comments, links,
profile identity, counters, or started-date data. Remaining asset references to
`aurora-placeholder.svg` are confined to legacy compatibility fixtures and
their regression assertions; no public Demo HTML contains them.

The final handoff records exact command results, screenshot coverage, and the
remaining external verification boundaries (production provider continuity,
live Pages settings, and third-party remote image availability).

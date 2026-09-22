# Aurora 3.0 visual parity audit

**Status: READY FOR ASTRA REVIEW**

This audit compares the Astro implementation with the upstream Aurora theme at
`auroral-ui/hexo-theme-aurora`, pinned locally at commit
`4b82d1c567aa74d060eddebf87de3ab3edf9ff59`. The upstream source and README
previews remain the visual source of truth. Astro static routing, Content
Collections, the single Markdown pipeline, Pagefind, static HTML, and scoped
Vue islands remain architectural contracts.

## Migration matrix

| Original component / layout | Current Astro implementation | Result | Verification evidence |
| --- | --- | --- | --- |
| Header, logo, navigation, controls | `Header.astro`, `Icon.astro`, `ThemeIsland.vue` | Aurora gradient shell, logo treatment, SVG controls, language control, theme control, and responsive trigger restored | `output/playwright/visual/home-light-1440x900.png`; `home-light-390x844.png` |
| Search modal | `SearchIsland.vue` | Pagefind remains the backend; header keeps a `/search/` fallback and opens an Aurora-style blurred overlay when hydrated | `tests/browser/rc.spec.ts` header-search test; `search-light-1440x900.png` |
| Home feature hero | `Feature.astro`, `HorizontalArticle.astro` | Wide cover/content hero restored; invented “quiet place” copy removed | `home-light-1440x900.png` |
| Feature list / editor selection | `Feature.astro`, `PostCard.astro` | Editor-selection panel, cover screens, secondary cards, metadata, and glow restored | `home-light-1440x900.png`; `home-dark-1440x900.png` |
| Category tabs | `CategoryTabs.astro` | Count-bearing segmented tabs and active gradient restored | `home-light-1280x800.png` |
| Article cards | `PostCard.astro`, `TagList.astro` | Cover, gradient screen, category, tags, title, excerpt, author, date, proportions, and hover treatment restored | `home-light-1440x900.png` |
| Magazine main grid | `pages/index.astro`, `global.css` | Desktop article column plus sidebar; tablet and mobile collapse follow the Aurora breakpoints | `home-light-1024x800.png`; `home-light-390x844.png` |
| Sidebar / profile | `Sidebar.astro` | Profile, diamond avatar, SVG social buttons for configured links, statistics, and glow restored | `home-light-1440x900.png` |
| Tag box / recent comments | `Sidebar.astro` | Count-bearing tag box, localized Demo fixture comments, and provider-safe no-data fallback | `home-light-1440x900.png`; Showcase browser assertions |
| Pagination | `Pagination.astro` | Static numbered/active pagination retained with Aurora gradient state | `home-light-1280x800.png` |
| Article header / cover | `pages/post/[...slug].astro`, `global.css` | Cover hero, metadata, author row, reading stats, gradient veil, and glow restored | `article-light-1440x900.png`; `article-dark-1440x900.png` |
| Article body | `global.css`, existing Markdown pipeline | Headings, rules, links, lists, blockquotes, custom containers, code, tables, images, and lightbox boundary styled without a second renderer | `article-light-1440x900.png` |
| TOC / post navigation / comments | `pages/post/[...slug].astro`, existing islands | Aurora panels and navigation restored; comment identity and provider boundary remain unchanged | `article-light-1440x900.png`; RC browser suite |
| Archives | `pages/archives/*` | Centered gradient timeline with year markers and responsive mobile line restored | `archives-light-1280x800.png`; `archives-light-390x844.png` |
| Tags / categories | `pages/tags/*`, `pages/categories/*` | Aurora chips/clouds, counts, accent states, and result cards restored | `tags-light-1280x800.png`; `categories-1440x900.png` |
| Friends links | `pages/links/index.astro`, `FriendLinks.astro` | Upstream gradient-framed avatar wall populated with categorized, localized Demo Resources; empty fallback remains for ordinary builds | `links-light-1440x900.png`; Showcase browser assertions |
| Footer | `Footer.astro` | Gradient divider, grouped links, attribution, and avatar treatment restored | `home-light-1440x900.png` |
| Mobile menu | `MobileMenuIsland.vue` | SVG menu/close/theme controls, Aurora profile treatment, responsive panel, Escape and backdrop close restored | RC browser suite; `home-light-390x844.png` |
| Light/dark themes and glow | `theme-variables.css`, `global.css` | Full upstream semantic token families, cover gradients, shadows, background colors, and highlighted glow restored | `*-light-*` and `*-dark-*` fixtures |
| Responsive behavior | `global.css` | Verified at 1440, 1280, 1024, 768, 390, and 375 widths with no horizontal overflow | 60-fixture capture matrix |

## Source references used

- `visual-reference/upstream/source/src/App.vue`
- Upstream `pages/index.vue`, `pages/post/[slug].vue`, `pages/archives.vue`,
  `pages/tags.vue`, `pages/category.vue`, and `pages/links.vue`
- Upstream Header, Feature, ArticleCard, Sidebar, Footer, Tag, MobileMenu,
  Navigator, PageContent, Paginator, SearchModal, Social, and Link components
- Upstream `src/styles/theme-variables.scss`, `index.scss`,
  `components/article.scss`, `components/sidebar-box.scss`,
  `components/search-modal.scss`, and `transitions.scss`
- Upstream README screenshots in `visual-reference/upstream/previews/`
- Upstream MIT license in `visual-reference/upstream/LICENSE`; attribution is
  retained in `src/styles/theme-variables.css`, the footer, and README.

## Verification evidence

The visual capture command targets the rebuilt standalone Demo preview:

```text
VISUAL_ORIGIN=http://127.0.0.1:4322 \
VISUAL_BASE=/astro-theme-aurora/demo \
pnpm visual:capture
Captured 84 Showcase visual fixtures in output/playwright/visual
```

The matrix covers home, article, archives, tags, and search in light and dark
themes at 1440, 1280, 1024, 768, 390, and 375 widths. `output/playwright/` is
ignored generated evidence; the four README previews are the committed showcase
fixtures.

## Regression gates

- `pnpm check` — passed after the final visual changes.
- `pnpm build` — passed; 54 static pages and two Pagefind language indexes built.
- `pnpm test:browser` — passed as standalone RC coverage: 6/6 tests, including
  the header search overlay and no-JS fallback.
- `pnpm test:browser:pages` — passed Pages coverage: 3/3 tests; 5 standalone
  tests are correctly skipped by the combined Pages suite.
- Earlier migration gates remain part of the required release record:
  `pnpm test`, `pnpm test:readme`, `pnpm pages:build`, `pnpm test:pages`,
  `ASTRO_BASE=/aurora/ pnpm build`, `ASTRO_BASE=/blog/theme/ pnpm build`, and
  `git diff --check`.

## Remaining visual gaps

These are explicit content/configuration boundaries, not untracked layout work:

1. Upstream screenshots use the production site's photography, Chinese copy,
   author identity, and provider-backed comment/link records. This repository
   uses deterministic Showcase fixtures, so text and image pixels cannot be
   identical while preserving safe local content.
2. Showcase profile/social/comment/link values are intentionally labeled and
   isolated Demo data. Ordinary builds keep configured real values or render the
   corresponding empty state; they do not inherit Showcase counters or records.
3. CSS remains a single migration stylesheet for this RC to keep token and
   breakpoint review local; splitting it into component files is maintenance
   follow-up and does not affect the visual contract.

## Checklist

- [x] Header, logo, navigation, and controls
- [x] Feature hero and feature list
- [x] Horizontal first article
- [x] Category tabs and pagination
- [x] Article cards and magazine grid
- [x] Sidebar, profile, tag box, Demo recent comments, and provider-safe fallback
- [x] Article header, cover, body, TOC, post navigation, and comments shell
- [x] Archives timeline
- [x] Tags and categories
- [x] Search modal with Pagefind backend
- [x] Footer, Demo statistics/running days, and MIT attribution
- [x] Categorized Friend Links and localized Showcase About/Profile surfaces
- [x] Mobile menu
- [x] Light theme, dark theme, and Aurora glow
- [x] Responsive layout and no-overflow screenshot matrix

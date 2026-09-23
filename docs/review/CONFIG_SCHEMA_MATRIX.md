# Aurora 3 Configuration Schema Matrix

This matrix describes the canonical root `_config.yml` interface implemented by `src/lib/config-schema.ts` and `src/lib/config-loader.ts`. YAML is normalized for explicitly supported Aurora 2 aliases before strict Zod validation. Runtime consumers receive a deep-frozen normalized config; the browser receives only individual values needed by an island.

**Precedence:** environment overrides > `_config.yml` > Aurora defaults. A missing file uses defaults. Malformed YAML, unknown canonical keys, and invalid canonical values fail the build. `ASTRO_CONFIG_FILE` is a test/build fixture selector, not a theme setting.

| Canonical path | Default | Validation / bounds | Consumer |
| --- | --- | --- | --- |
| `site.title` | `My Aurora Blog` | Trimmed, 1–120 chars | Header, metadata, RSS |
| `site.subtitle` | empty | Trimmed, max 240 | Header |
| `site.author` | `Author` | Trimmed, 1–120 | Sidebar/footer |
| `site.description` | empty | Max 500 | Sidebar, SEO/RSS |
| `site.avatar`, `site.logo` | empty, `/favicon.svg` | Root-relative single-slash path or credential-free HTTP(S) URL | Sidebar/footer/header |
| `site.language` | `en` | `en` or `zh-CN` | Default labels for routes without an explicit locale |
| `site.started_date` | empty | Real calendar date `YYYY-MM-DD` | Footer running-day count |
| `site.url` | `https://example.com` | HTTP(S) origin only; no path/query/fragment or URL credentials | Astro `site`, canonical/SEO/feeds |
| `site.base` | `/` | Absolute, trailing slash, safe path segments; rejects `//`, dot segments, query/hash, control/space/backslash | Astro `base`, assets/routes/feeds |
| `i18n.default_locale`, `i18n.locales` | `en`, `[en, zh-CN]` | Fixed tuple; not extensible | Static route architecture |
| `theme.feature` | `true` | Boolean | Existing home-post selection |
| `theme.dark_mode` | `true` | Boolean; selects initial theme | `<html data-default-theme>` |
| `theme.profile_shape` | `diamond` | `circle`, `diamond`, `rounded` | Sidebar/footer avatar classes |
| `theme.gradient.color_1..3` | Aurora cyan/purple/pink | Hex colors only | Root CSS variables |
| `menu.home/tags/categories/archives/about` | `true` | Boolean | Localized built-in navigation |
| `menu.links` | `false` | Boolean | Friend-link navigation |
| `socials[]` | `[]` | Up to 32; nonempty label <=40; HTTP(S), `mailto:`, or `tel:`; icon `github` or `link` | Sidebar fallback socials |
| `comments.provider` | `none` | `none`, `giscus`, `waline`, `twikoo`, `valine`; Gitalk selection fails with localized migration guidance | Article comments/recent capability |
| `comments.recent_comments.enabled/count` | `true` / `5` | Boolean; integer 1–20 | Twikoo/Waline sidebar widget |
| `comments.giscus.*` | empty public IDs, `pathname`, auto theme/locale, eager loading | Validated GitHub `owner/repo`, required `repo_id` and conditional `category_id`; six mapping enums; required `term` for `specific`/`number`; boolean/options enums | Official Vue giscus widget |
| `comments.valine.*` | public IDs empty; documented UI defaults | Avatar enum; booleans; locale; bounded placeholder and field lists | Valine init and legacy identity |
| `comments.twikoo.*` | empty/`auto` | Public environment ID <=500, region <=80, locale | Twikoo init and Recent Comments |
| `comments.waline.*` | empty/`auto`/false/disable/default field lists/latest/0/10 | HTTP(S) server URL; locale/login/sort enums; booleans; word limit 0–10000; page size 1–100 | Waline init and Recent Comments |
| `dia.enabled/locale/tips` | false/auto/empty | Boolean; `auto`/`en`/`zh-CN`; up to 20 strings, 1–240 chars | Dia island |
| `footer.show_version/show_avatar` | true/true | Boolean | Footer |
| `footer.statistics.*` | empty | Display strings <=40; not a live analytics integration | Footer |
| `footer.beian.*` | empty | Bounded strings; links empty or HTTP(S) | Footer |
| `links[]` | `[]` | Up to 200; required name, HTTP(S) URL, safe optional avatar, bounded description/category, hex color | Friend Links page |
| `seo.keywords` | `[]` | Up to 40 strings, 1–80 chars | BaseLayout metadata |

## Environment overrides

`ASTRO_SITE`, `ASTRO_BASE`; `PUBLIC_AURORA_TITLE`, `SUBTITLE`, `AUTHOR`, `DESCRIPTION`, `LOCALE`, `AVATAR`, `LOGO`, `STARTED_DATE`, `DIA`, `PAGE_VIEWS`, `UNIQUE_VISITORS`, `BEIAN_NUMBER`, `BEIAN_LINK`, `POLICE_BEIAN_NUMBER`, `POLICE_BEIAN_LINK`; `PUBLIC_COMMENT_PROVIDER`, `PUBLIC_VALINE_APP_ID`, `PUBLIC_VALINE_APP_KEY`, `PUBLIC_TWIKOO_ENV_ID`, `PUBLIC_TWIKOO_REGION`, and `PUBLIC_WALINE_SERVER_URL` override supported values. giscus uses `_config.yml` only; no giscus credential or environment override exists. Obsolete Gitalk environment names are ignored without reading values, and never select a runtime. `PUBLIC_*` inputs are public, not secret storage.

`ASTRO_DEMO_BUILD`, `ASTRO_PREFLIGHT_TESTS`, and `ASTRO_CONFIG_FILE` control isolated builds/tests. GFM, Math/KaTeX, and Shiki are always-on and are intentionally not represented by false configuration toggles.

## Selected Aurora 2 aliases

The loader normalizes `site.startedDate`; menu keys `Home/Tags/Categories/Archives/About/Friends`; selected camelCase Valine/Twikoo/Waline keys and root sections; `aurora_bot` to `dia`; `site.beian`/`police_beian` to `footer.beian`; `site_meta` to supported `site`/`seo` fields; and object-shaped `socials` to a constrained link list. Aurora 2 root `gitalk` is detected and discarded without inspecting field values. Canonical `comments.gitalk` is rejected as unknown, and `comments.provider: gitalk` receives localized migration guidance. Unknown keys fail validation instead of disappearing silently.

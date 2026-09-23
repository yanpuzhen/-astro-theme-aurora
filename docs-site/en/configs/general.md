# General Configuration

The root `_config.yml` is the user-facing source for routine Aurora settings. The build parses YAML, normalizes selected documented Aurora 2 aliases, validates the canonical object with Zod, fills defaults, and applies environment overrides. Precedence is **environment overrides > `_config.yml` > Aurora defaults**. A missing file uses defaults; malformed YAML and invalid/unknown canonical values fail the build with a field path. Components consume the normalized config; they do not parse YAML.

```yaml
site:
  title: My Aurora Blog
  subtitle: A personal blog
  author: Your Name
  description: A static-first multilingual blog.
  avatar: /images/avatar.png
  logo: /favicon.svg
  language: en # en | zh-CN; route families remain English + zh-CN
  started_date: '' # optional YYYY-MM-DD
  url: https://example.com # origin only; no path/query/fragment
  base: / # /, /aurora/, /blog/theme/, etc.
theme:
  feature: true
  dark_mode: true
  profile_shape: diamond # circle | diamond | rounded
  gradient: { color_1: '#24c6dc', color_2: '#5433ff', color_3: '#ff0099' }
menu: { home: true, tags: true, categories: true, archives: true, about: true, links: false }
socials:
  - { label: GitHub, href: https://github.com/you, icon: github }
```

## Configuration surface

| Section | Supported purpose / validation |
| --- | --- |
| `site` | Title, subtitle, author, description, avatar/logo, display language, real `YYYY-MM-DD`, origin-only HTTP(S) URL, safe base path. |
| `i18n` | Fixed English default and `[en, zh-CN]`; this is not a language-plugin interface. |
| `theme` | Feature selection, initial light/dark appearance, profile shape, three hex gradient colors. |
| `menu` | Boolean switches for the six built-in routes; labels and route structure are localized/fixed. |
| `socials` | Up to 32 safe HTTP(S), `mailto:`, or `tel:` links; icon is `github` or `link`. |
| `comments` | `provider` plus tested provider fields; see [Integrations](/configs/integrations). No client secret fields are accepted. |
| `dia` | Enable flag, `auto`/English/Chinese locale, up to 20 short text tips. |
| `footer` | Version/avatar visibility, manual display-only statistics, and optional filing links. No analytics backend is implied. |
| `links` | Up to 200 validated friend-link records with name, URL, avatar, description, category, and color. |
| `seo` | Up to 40 site keywords; page frontmatter keywords take precedence. |

Strict canonical sections reject unknown keys so typos do not disappear. YAML booleans should be written as `true`/`false`, dates as quoted ISO strings, and colors as `#RRGGBB`-style hex values. URLs must be absolute HTTP(S), except social `mailto:`/`tel:` links. Do not put secrets in this static configuration: anything passed to a browser is public.

### Environment overrides

`ASTRO_SITE` and `ASTRO_BASE` override `site.url` and `site.base`. Optional existing `PUBLIC_AURORA_*`, `PUBLIC_COMMENT_PROVIDER`, and provider `PUBLIC_*` values are build-time public overrides for deployment/CI compatibility; leave them blank to use YAML. `PUBLIC_AURORA_DIA` must be an explicit boolean string. `ASTRO_DEMO_BUILD`, `ASTRO_CONFIG_FILE`, and `ASTRO_PREFLIGHT_TESTS` are build/test controls, not routine theme settings. See `.env.example` for the complete current list.

GFM, math/KaTeX, and Shiki are always-on build capabilities, not fake user toggles. Demo identity and content are selected by the dedicated Demo build, not inherited from production user settings.

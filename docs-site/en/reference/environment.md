# Environment Variables

Environment values are read at build time and override matching `_config.yml` values when nonempty. A changed deployment variable requires a rebuild. Copy `.env.example` for the current variable names; leave unused optional values blank. Do not commit a real `.env` file.

## Normal deployment overrides

| Variable | Overrides | Use |
| --- | --- | --- |
| `ASTRO_SITE` | `site.url` | Canonical HTTP(S) origin only, such as `https://example.com`. |
| `ASTRO_BASE` | `site.base` | Root `/` or a safe slash-bounded path such as `/my-blog/`. |
| `PUBLIC_AURORA_TITLE`, `SUBTITLE`, `AUTHOR`, `DESCRIPTION` | matching `site.*` fields | Public site metadata. |
| `PUBLIC_AURORA_LOCALE`, `AVATAR`, `LOGO`, `STARTED_DATE` | `site.language`, `avatar`, `logo`, `started_date` | Public appearance and metadata. |
| `PUBLIC_AURORA_DIA` | `dia.enabled` | Explicit true/false string. |
| `PUBLIC_AURORA_PAGE_VIEWS`, `UNIQUE_VISITORS` | `footer.statistics.*` | Manual display values, not live analytics. |
| `PUBLIC_AURORA_BEIAN_NUMBER`, `BEIAN_LINK`, `POLICE_BEIAN_NUMBER`, `POLICE_BEIAN_LINK` | `footer.beian.*` | Public filing labels and links. |

`PUBLIC_AURORA_` is part of each complete variable name above. For example, the avatar variable is `PUBLIC_AURORA_AVATAR`. Empty values do not override YAML.

## Public provider overrides

| Variable | Overrides |
| --- | --- |
| `PUBLIC_COMMENT_PROVIDER` | `comments.provider` |
| `PUBLIC_VALINE_APP_ID`, `PUBLIC_VALINE_APP_KEY` | `comments.valine.app_id`, `app_key` |
| `PUBLIC_TWIKOO_ENV_ID`, `PUBLIC_TWIKOO_REGION` | `comments.twikoo.env_id`, `region` |
| `PUBLIC_WALINE_SERVER_URL` | `comments.waline.server_url` |

Configure giscus public repository/category identifiers in `_config.yml`. All `PUBLIC_*` values can reach the browser in a static build. Never put passwords, database URLs, GitHub PATs, OAuth secrets or admin credentials in them. Waline/Twikoo server secrets belong in their backend deployment; Valine's public client key is not its LeanCloud Master Key.

## Build and test controls

| Variable | Role |
| --- | --- |
| `ASTRO_DEMO_BUILD` | `true` selects only `demo: true` Showcase content; ordinary builds exclude it. |
| `ASTRO_CONFIG_FILE` | Alternative config file path for tests or deliberate specialized builds. |
| `ASTRO_PREFLIGHT_TESTS` | Internal preflight fixture control. |
| `ASTRO_PATH_SLUG` | Legacy route test/compatibility mode (`uid`); prefer explicit frontmatter for user sites. |
| `PLAYWRIGHT_ORIGIN`, `PLAYWRIGHT_BASE_PATH`, `PLAYWRIGHT_PAGES` | Browser test targets and mode; not site settings. |

Use `ASTRO_SITE=https://username.github.io ASTRO_BASE=/my-blog/ pnpm build` for a project site. [Domains and Base Paths](/deploy/domains-and-base) explains how these values affect canonical URLs and feeds.

# Integrations

Routine integration settings belong in `_config.yml`. All browser settings are public; never put private credentials in YAML or `PUBLIC_*` variables.

## Comments

First-class providers are **giscus, Waline, and Twikoo**. Valine remains a legacy runtime. `none` disables the comment island and loads no provider assets. Gitalk is removed from Aurora 3 runtime selection; see the [migration guide](/upgrade/from-aurora-2).

### giscus setup

1. Enable GitHub Discussions on a public repository and install the [giscus GitHub App](https://github.com/apps/giscus) for that repository.
2. Use [giscus.app](https://giscus.app) to obtain the repository and category IDs. Choose a category that accepts new discussions.
3. Add the public identifiers to `_config.yml`:

```yaml
comments:
  provider: giscus
  giscus:
    repo: example/blog-comments
    repo_id: R_example
    category: General
    category_id: DIC_example
    mapping: pathname
    term: ''
    strict: false
    reactions_enabled: true
    emit_metadata: false
    input_position: bottom
    theme: auto
    lang: auto
    loading: eager
```

`repo`, `repo_id`, and `category_id` are required for automatic discussion creation. With `mapping: number`, a positive discussion number in `term` selects an existing discussion and `category_id` may be omitted. `mapping: specific` requires a nonempty `term`. Other supported mappings are `url`, `title`, and `og:title`. The default `pathname` uses the browser's deployed path: changing `ASTRO_BASE`, a custom permalink, or a locale route can create a different Discussion. For a planned migration, use `specific` with `term: "{legacyUid}"` for a per-page stable UID after confirming converted Discussion titles, or use a literal term for a single shared discussion. A global `number` term points every page to that one Discussion. There is no automatic Gitalk Issue match.

`theme: auto` follows Aurora’s resolved Light/Dark theme without reloading the page. Normal pages resolve the theme from the URL override, saved visitor choice, then `theme.dark_mode`; having no saved choice does not itself select System mode. Only when `html[data-theme]` is absent does giscus follow system color-preference changes. This integration does not add a System-mode control. Explicit themes are `light`, `dark`, and `dark_dimmed`; arbitrary CSS URLs are rejected. `lang: auto` maps Aurora routes to `en` or `zh-CN`; explicit `en` and `zh-CN` are supported. Aurora hydrates the comment island when visible, so `loading: eager` is the default inside it; `lazy` remains available. The giscus iframe is hosted by giscus.app and GitHub authorization occurs in giscus, with no site OAuth secret or PAT. If you set a CSP, allow giscus.app for frames and the connections required by giscus. The iframe content remains outside Aurora's CSS and DOM.

### Other providers and capability

| Provider | Role | Client | Recent Comments | Production backend |
| --- | --- | --- | --- | --- |
| giscus | FIRST-CLASS | Official `@giscus/vue` 3.1.1, GitHub Discussions | No theme API | Configure your repository; not verified by local mocks |
| Waline | FIRST-CLASS | Pinned 3.15.2 | Yes | Configure a reachable server |
| Twikoo | FIRST-CLASS | Pinned 2.0.8 | Yes | Configure a reachable service |
| Valine | LEGACY RUNTIME | Pinned 1.5.3 | No theme API | Public App ID/key; never admin credentials |

```yaml
comments:
  provider: waline # or twikoo, valine, giscus, none
  waline:
    server_url: https://comments.example.com
    language: auto
  twikoo:
    env_id: https://comments.example.com
    language: auto
  valine:
    app_id: ''
    app_key: ''
    language: auto
```

The Sidebar shows live Recent Comments only for Waline and Twikoo. With giscus it shows the normal empty/unavailable state; Demo uses deterministic local fixtures. Local browser mocks verify the integration boundary without posting to GitHub. Live service availability and old-record continuity require a site-specific check.

## Search, media, and utilities

- **Pagefind** indexes generated HTML after `astro build`; no Algolia credentials are used.
- **Lightbox** enhances ordinary generated article images; no-JS content remains readable.
- **Code copy** enhances generated code blocks.
- **Dia** is configured by `dia.enabled`, `dia.locale`, and optional `dia.tips`; Demo content is deterministic.

## Footer and feeds

`footer.statistics.page_views` and `unique_visitors` are manual display strings, not live analytics. `site.started_date` computes the running-day display; `footer.beian` is optional.

Root deployments publish `/rss.xml`, `/cn/rss.xml`, `/sitemap.xml`, and `/robots.txt`. All use the configured `site.url` and `site.base`; `ASTRO_SITE`/`ASTRO_BASE` override them for a build. GitHub Pages Demo outputs are `/astro-theme-aurora/demo/rss.xml`, `/astro-theme-aurora/demo/cn/rss.xml`, `/astro-theme-aurora/demo/sitemap.xml`, and `/astro-theme-aurora/demo/robots.txt`. English and Chinese feeds include only their locale. Ordinary builds exclude Demo-marked entries; `rss: false` and `sitemap: false` frontmatter opt an otherwise public entry out of the respective index.

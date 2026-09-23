# Integrations

Routine integration settings belong in `_config.yml`; optional public ENV values are deployment overrides. Never put private credentials in YAML or `PUBLIC_*` variables.

## Comments

Select one provider with `comments.provider`. The snippets below are public client configuration, not private credentials:

```yaml
comments:
  provider: waline # none | waline | twikoo | valine
  waline:
    server_url: https://comments.example.com
    language: auto # auto | en | zh-CN
    reaction: false
    login: disable # enable | disable | force
    page_size: 10
  twikoo:
    env_id: https://comments.example.com
    region: ''
    language: auto
  valine:
    app_id: ''
    app_key: ''
    language: auto
```

| Provider | Role | Runtime bundled | Identity compatibility | Secure OAuth runtime | Reason / production backend verification |
| --- | --- | --- | --- | --- | --- |
| Waline | FIRST-CLASS RUNTIME | YES — 3.15.2 | YES — trailing-slash pathname | NOT APPLICABLE | Requires a reachable configured server; production backend is not verified here. |
| Twikoo | FIRST-CLASS RUNTIME | YES — 2.0.8 | YES — trailing-slash pathname | NOT APPLICABLE | Supports `getRecentComments`; requires a configured service; production backend is not verified here. |
| Valine | LEGACY RUNTIME | YES — 1.5.3 | YES — pathname without trailing slash | NOT APPLICABLE | No theme Recent Comments API; App ID/key are public client values, never admin/master credentials. |
| Gitalk | LEGACY IDENTITY / MIGRATION COMPATIBILITY | NO | YES — legacy UID and pathname | NOT PROVIDED | Upstream browser client requires `clientSecret`; Aurora does not expose it or provide an OAuth backend/fork. Production backend verification: NOT APPLICABLE. |

The three bundled client versions and initialization shapes are centralized in `src/lib/comment-adapters.ts`; Gitalk is absent from runtime adapters and exists only for identity/migration compatibility. Scripts and required CSS are loaded only by an enabled integration; failures show a localized status and do not remove the article. `none` loads no provider assets. Theme Recent Comments are supported only for Twikoo and Waline. Gitalk selection is rejected with localized configuration guidance recommending Waline or Twikoo. Provider responses are reduced to plain text, same-origin/base-aware links, safe avatars, and timestamps; arbitrary HTML is never rendered.

The browser suite uses deterministic local mocks for bundled clients and verifies the adapter-to-island initialization boundary; Gitalk has identity-only regression coverage and no runtime mock or initialization claim. This is **client integration verification**, not backend verification. No production provider credentials or comment records were supplied; real backend availability and record continuity remain **not externally verified**. Demo recent comments are fixed local showcase data and never query or write to a live provider.

## Search, media, and utilities

- **Pagefind** indexes generated HTML after `astro build`; no Algolia credentials are used.
- **Lightbox** enhances ordinary generated article images; no-JS content remains readable.
- **Code copy** enhances generated code blocks.
- **Dia** is configured by `dia.enabled`, `dia.locale`, and optional `dia.tips`; Demo content is deterministic.

## Footer and feeds

`footer.statistics.page_views` and `unique_visitors` are manual display strings, not live analytics. `site.started_date` computes the running-day display; `footer.beian` is optional.

Root deployments publish `/rss.xml`, `/cn/rss.xml`, `/sitemap.xml`, and `/robots.txt`. All use the configured `site.url` and `site.base`; `ASTRO_SITE`/`ASTRO_BASE` override them for a build. GitHub Pages Demo outputs are `/astro-theme-aurora/demo/rss.xml`, `/astro-theme-aurora/demo/cn/rss.xml`, `/astro-theme-aurora/demo/sitemap.xml`, and `/astro-theme-aurora/demo/robots.txt`. English and Chinese feeds include only their locale. Ordinary builds exclude Demo-marked entries; `rss: false` and `sitemap: false` frontmatter opt an otherwise public entry out of the respective index.

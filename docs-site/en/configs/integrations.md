# Integrations

Aurora's optional browser integrations are configured at build time. For a working comment service, select [giscus, Waline, Twikoo or Valine](/comments/) and follow that provider's backend and verification guide. `comments.provider: none` loads no provider assets. Gitalk is removed; see [migration](/comments/gitalk-migration). The [configuration reference](/configs/general) lists every supported key and default.

- **Pagefind** indexes generated HTML after `pnpm build`; no hosted search account is required.
- **Lightbox** and **code copy** enhance generated article images and code blocks. The content remains readable without JavaScript.
- **Dia** uses `dia.enabled`, `dia.locale`, and optional `dia.tips`.
- **Footer statistics** are manually supplied strings, not live analytics. `site.started_date` controls the running-day display.
- **RSS, sitemap and robots** are generated automatically. See [SEO and Feeds](/reference/seo-feeds).

Public client identifiers may appear in `_config.yml` or `PUBLIC_*` overrides. Provider database credentials and admin secrets belong on the provider backend, never in Aurora's static site.

# Integrations

Aurora keeps interactive or external integrations isolated from the static content layer.

## Search, media, and utilities

- **Pagefind** indexes generated HTML after `astro build`; no Algolia credentials are used.
- **Lightbox** enhances article images when the island loads; images remain ordinary HTML without JavaScript.
- **Code copy** adds a copy button to generated code blocks.
- **Dia** is opt-in with `PUBLIC_AURORA_DIA=true` and uses no external backend in the Demo. It keeps the original orb/body/eyes/platform composition, localized tips, contextual `data-dia` hooks, keyboard focus, mobile hiding, and reduced-motion behavior.
- **RSS**, **sitemap**, and **robots** are generated as static files.

## Comments

Set `PUBLIC_COMMENT_PROVIDER` to `none`, `gitalk`, `valine`, `twikoo`, or `waline`. The theme hides the comments region when no provider is configured. The Demo sidebar's recent comments are deterministic local fixtures and never enter a provider database.

## Footer and site statistics

Configure `PUBLIC_AURORA_STARTED_DATE` as `YYYY-MM-DD` to show real running days. `PUBLIC_AURORA_PAGE_VIEWS` and `PUBLIC_AURORA_UNIQUE_VISITORS` are intentionally plain public build values for an existing integration; leave them blank to hide those rows. `PUBLIC_AURORA_AVATAR` configures the footer avatar. Optional `PUBLIC_AURORA_BEIAN_*` variables render备案 links only when supplied. The Demo uses clearly labeled fixture values and a fixed showcase start date.

| Provider | Build variables | Identity |
| --- | --- | --- |
| Gitalk | `PUBLIC_GITALK_CLIENT_ID`, `PUBLIC_GITALK_OWNER`, `PUBLIC_GITALK_REPO` | Legacy UID by default; pathname mode is available. |
| Valine | `PUBLIC_VALINE_APP_ID`, `PUBLIC_VALINE_APP_KEY` | Historical pathname without trailing slash. |
| Twikoo | `PUBLIC_TWIKOO_ENV_ID` | Historical pathname with trailing slash. |
| Waline | `PUBLIC_WALINE_SERVER_URL` | Historical pathname with trailing slash. |

Production provider records were not available for verification. Compare representative old comment keys before switching traffic. There is intentionally no static `PUBLIC_GITALK_CLIENT_SECRET`; OAuth secrets must stay in a trusted service.

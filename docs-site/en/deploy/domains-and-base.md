# Domains and Base Paths

Aurora uses two separate values: **origin** (`site.url` or `ASTRO_SITE`) and **path prefix** (`site.base` or `ASTRO_BASE`). The origin is an HTTP(S) URL without a path, query or fragment. The base is `/` or a safe path starting and ending with `/`. Do not put `/blog/` in both values.

| Public address | Origin / `ASTRO_SITE` | Base / `ASTRO_BASE` |
| --- | --- | --- |
| `https://example.com/` | `https://example.com` | `/` |
| `https://blog.example.com/` | `https://blog.example.com` | `/` |
| `https://example.com/blog/` | `https://example.com` | `/blog/` |
| `https://username.github.io/my-blog/` | `https://username.github.io` | `/my-blog/` |

For example, `https://example.com/blog/` is **not** `site.url: https://example.com/blog/`. That fails origin-only validation. Use `site.url: https://example.com` with `site.base: /blog/`, or equivalent environment overrides. A nested base must have both leading and trailing slashes; `/blog` fails validation. Avoid spaces, duplicate slashes, query/fragment text, and `.`/`..` segments.

The pair controls generated links, canonical and alternate URLs, local assets, Pagefind result paths, RSS item URLs, Sitemap entries and the absolute Sitemap directive in robots.txt. A custom domain served at root normally changes the origin and sets base to `/`; update both and rebuild. Configure DNS and domain ownership in your host's official dashboard, then verify the real HTTPS address. A preview deployment should retain the production canonical origin intentionally or use an isolated preview configuration; do not accidentally publish preview URLs as canonical.

**Comment identity can change with the path.** giscus `pathname` maps `/post/example/` and `/my-blog/post/example/` to different Discussions. Changing a permalink or locale path can do the same. Before moving a site, compare actual provider records; [giscus mapping](/comments/giscus) and [Gitalk migration](/comments/gitalk-migration) explain the choices.

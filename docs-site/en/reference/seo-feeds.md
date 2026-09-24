# SEO, RSS, Sitemap and Robots

Aurora generates static metadata and discovery files during `pnpm build`. Set `site.url` to the production origin and `site.base` to the deployed path before building; `ASTRO_SITE` and `ASTRO_BASE` override them. A wrong origin/base produces wrong canonical and feed URLs even if the HTML files load.

| Resource at root base | Purpose |
| --- | --- |
| `/rss.xml` | Public English posts with `rss` enabled. |
| `/cn/rss.xml` | Public Chinese posts with `rss` enabled. |
| `/sitemap.xml` | Canonical site routes and public content with `sitemap` enabled. |
| `/robots.txt` | Allows crawling and points to the absolute sitemap URL. |

For `/my-blog/`, prepend that base to every path above. Draft, hidden, unpublished and ordinary-build-excluded Demo posts do not enter public routes or feeds. `rss: false` and `sitemap: false` opt an otherwise public post out of one resource only. The sitemap flag does not add a `noindex` directive; do not use it to hide confidential content. Pages are in the sitemap when public but are not RSS items.

Each page emits a canonical URL, description when available, OpenGraph/Twitter metadata, and JSON-LD. Articles also carry author/date/tag metadata. Page `keywords` override site `seo.keywords`; page descriptions and cover images improve sharing cards. Real translation pairs emit alternate-language links; unpaired pages do not claim a nonexistent translation. Both RSS routes are advertised in page HTML. After deployment, fetch the four resources and inspect absolute URLs, especially after a custom-domain or base-path change.

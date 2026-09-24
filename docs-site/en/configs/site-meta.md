# Site Meta and Feeds

`BaseLayout.astro` emits build-time metadata from the validated configuration and each page's content metadata:

- Canonical URLs use `site.url`, `site.base`, and the canonical route resolver.
- OpenGraph/Twitter metadata uses the page title/description/cover, falling back to `site.description` and `seo.keywords`.
- Article pages include author, publication/update dates, and tags; JSON-LD describes the site or article.
- Each page advertises the English and Chinese RSS paths.

Static routes are `/rss.xml` (English), `/cn/rss.xml` (Simplified Chinese), `/sitemap.xml` (canonical URLs), and `/robots.txt` (with an absolute sitemap directive). They are emitted at the build's configured base. `site.url` is an origin only, while `site.base` is a slash-bounded path. `ASTRO_SITE` and `ASTRO_BASE` override them for deployment.

For your blog, run `pnpm build` and publish `dist/`; inspect the generated canonical URLs, feeds and robots file. The combined `.pages-dist/` Docs/Demo artifact and `pnpm pages:build` are specific to Aurora project maintainers. A dev server alone does not verify production canonical URLs. See [SEO and Feeds](/reference/seo-feeds) and [Deployment](/deploy/).

Ordinary builds exclude Demo-marked content. Public entries default to RSS and sitemap inclusion; `rss: false` or `sitemap: false` in frontmatter opts out of one resource. The Demo profile, recent comments, friend links, counters, and start date are deterministic Showcase fixtures.

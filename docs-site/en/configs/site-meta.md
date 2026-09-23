# Site Meta and Feeds

`BaseLayout.astro` emits build-time metadata from the validated configuration and each page's content metadata:

- Canonical URLs use `site.url`, `site.base`, and the canonical route resolver.
- OpenGraph/Twitter metadata uses the page title/description/cover, falling back to `site.description` and `seo.keywords`.
- Article pages include author, publication/update dates, and tags; JSON-LD describes the site or article.
- Each page advertises the English and Chinese RSS paths.

Static routes are `/rss.xml` (English), `/cn/rss.xml` (Simplified Chinese), `/sitemap.xml` (canonical URLs), and `/robots.txt` (with an absolute sitemap directive). They are emitted at the build's configured base. `site.url` is an origin only, while `site.base` is a slash-bounded path. `ASTRO_SITE` and `ASTRO_BASE` override them for deployment.

For GitHub Pages Demo, the combined `.pages-dist/` artifact keeps documentation at `/astro-theme-aurora/` and the Demo at `/astro-theme-aurora/demo/`; Demo feeds, sitemap, and robots are nested under `/demo/` and do not overwrite documentation output. Use `pnpm pages:build` and `pnpm test:pages` to validate the publishable combined artifact. A dev server alone does not verify canonical URL correctness.

Ordinary builds exclude Demo-marked content. Public entries default to RSS and sitemap inclusion; `rss: false` or `sitemap: false` in frontmatter opts out of one resource. The Demo profile, recent comments, friend links, counters, and start date are deterministic Showcase fixtures.

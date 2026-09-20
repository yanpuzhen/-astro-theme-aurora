# 网页 Meta

每个生成页面都由 `BaseLayout.astro` 在构建时生成 Meta：

- canonical 使用 `ASTRO_SITE`、`ASTRO_BASE` 和路由解析器。
- OpenGraph 包含 title、type、URL、locale、site name、description 和封面（如果有）。
- Twitter card 根据封面使用 `summary` 或 `summary_large_image`。
- 文章包含作者、发布时间、修改时间和 tags。
- JSON-LD 对普通页面生成 `WebSite`，对文章生成 `BlogPosting`。
- `rss.xml`、`sitemap.xml` 和 `robots.txt` 由 Astro routes 生成。

project site 使用 `ASTRO_SITE=https://yanpuzhen.github.io` 与 `ASTRO_BASE=/-astro-theme-aurora/`；Demo 额外使用 `/demo/`。两个值必须与实际公开部署一致，开发 server 能监听不代表 canonical URL 正确。

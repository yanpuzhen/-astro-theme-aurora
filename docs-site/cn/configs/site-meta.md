# 网页 Meta 与 Feeds

`BaseLayout.astro` 根据规范化配置和页面内容元数据在构建时生成 SEO：

- canonical 使用 `site.url`、`site.base` 和 canonical 路由解析器。
- OpenGraph/Twitter 使用页面标题、描述、封面；缺少时回退到 `site.description` 和 `seo.keywords`。
- 文章包含作者、发布日期/更新时间和标签；JSON-LD 描述站点或文章。
- 每个页面都会声明英文和中文 RSS 路径。

静态资源路由为 `/rss.xml`（英文）、`/cn/rss.xml`（简体中文）、`/sitemap.xml`（canonical URL）和 `/robots.txt`（含绝对 sitemap 指令）。它们都会输出到当前构建配置的 base 下。`site.url` 仅填写 origin，`site.base` 是前后带斜杠的路径；部署环境中的 `ASTRO_SITE`、`ASTRO_BASE` 可覆盖二者。

GitHub Pages Demo 的组合 `.pages-dist/` 将文档放在 `/astro-theme-aurora/`，Demo 放在 `/astro-theme-aurora/demo/`；Demo 的 feeds、sitemap 和 robots 都位于 `/demo/` 下，不会覆盖文档输出。使用 `pnpm pages:build` 和 `pnpm test:pages` 检查最终可发布组合产物。仅启动开发服务器无法验证 canonical URL。

普通构建会排除 Demo 标记内容。公开条目默认加入 RSS 和 sitemap；frontmatter 可用 `rss: false` 或 `sitemap: false` 分别退出。Demo 个人资料、最新评论、友链、计数和开始日期均为确定性的 Showcase fixture。

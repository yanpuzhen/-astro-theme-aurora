# 从 Aurora 2.x 迁移

Aurora 3.0 是静态 Astro 实现，不是包级别的 Hexo theme 升级。请保留旧生成站点和评论 provider 配置，直到新 URL 与 identity 完成核对。

## 迁移步骤

1. 将文章复制到 `src/content/posts/`，页面复制到 `src/content/pages/`。
2. 保留旧 frontmatter，直到 collection schema 和构建检查通过。
3. 检查每个 custom permalink 和标题派生 UID；标题变化可能改变 legacy hash。
4. 复制 public assets，并把根相对引用改为 base-aware 路径。
5. 为目标部署设置 `ASTRO_SITE` 与 `ASTRO_BASE`。
6. 对实际 provider 比较代表性文章的评论 identity。
7. 在切换流量前运行根路径和 nested-base 构建、浏览器、搜索及无 JavaScript 检查。

适配器支持 scalar/list tags 和 categories、旧 author shape、`feature`、`sticky`、`pinned`、评论别名、显式 UID、custom permalink 以及可安全生成的 `.html` 兼容别名。

## 有意的差异

没有 Vue Router、SPA article store、runtime `/api/*.json` 或自动执行 Markdown script。Pagefind 替代 runtime article search data。author 页面、评论数量/最新评论以及完整旧 fence/image-source 行为在本 RC 中仍是条件性或不支持的功能。

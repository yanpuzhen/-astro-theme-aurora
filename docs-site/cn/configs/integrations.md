# 集成

日常集成设置放在 `_config.yml`；可选公开 ENV 仅作为部署覆盖。不要把私密凭证写入 YAML 或 `PUBLIC_*` 环境变量。

## 评论

使用 `comments.provider` 选择一种 provider。以下为公开客户端配置，不是私密凭证：

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

| Provider | 定位 | Runtime bundled | Identity compatibility | Secure OAuth runtime | 原因 / 生产后端验证 |
| --- | --- | --- | --- | --- | --- |
| Waline | FIRST-CLASS RUNTIME | YES — 3.15.2 | YES — 保留结尾斜杠的 pathname | NOT APPLICABLE | 支持 `RecentComments`；需要可访问的服务端，本仓库未验证生产后端。 |
| Twikoo | FIRST-CLASS RUNTIME | YES — 2.0.8 | YES — 保留结尾斜杠的 pathname | NOT APPLICABLE | 支持 `getRecentComments`；需要配置服务，本仓库未验证生产后端。 |
| Valine | LEGACY RUNTIME | YES — 1.5.3 | YES — pathname 不带结尾斜杠 | NOT APPLICABLE | 主题不提供 Recent Comments；App ID/key 是公开客户端值，不得使用 admin/master 凭证。 |
| Gitalk | LEGACY IDENTITY / MIGRATION COMPATIBILITY | NO | YES — legacy UID 与 pathname | NOT PROVIDED | 上游浏览器客户端要求 `clientSecret`；Aurora 不暴露它，不提供 OAuth 后端或 fork。生产后端验证：NOT APPLICABLE。 |

三个运行时客户端版本和初始化 API 集中在 `src/lib/comment-adapters.ts`；Gitalk 不在 runtime adapter 中，仅保留 identity/migration compatibility。只有启用的集成才加载脚本和所需 CSS；失败时显示本地化状态，文章仍可阅读。`none` 不加载 provider 资源。主题只为 Twikoo/Waline 提供 Recent Comments。选择 Gitalk 会收到本地化配置错误并推荐 Waline 或 Twikoo。服务端响应会归一化为纯文本、同源且符合 base 的链接、安全头像和时间；不会渲染任意 HTML。

浏览器测试以确定性本地 mock 覆盖运行时 adapter 到 island 的初始化边界；Gitalk 只有 identity 回归测试，不含运行时 mock 或初始化声明。这属于**客户端集成验证**，不等于真实后端验证。本仓库没有生产 provider 凭证或评论记录，真实后端可用性与记录连续性仍为**未做外部验证**。Demo 最新评论是本地固定 Showcase 数据，不会访问或写入线上 provider。

## 搜索、媒体与工具

- **Pagefind** 在 `astro build` 后索引 HTML，不使用 Algolia 凭据。
- **Lightbox** 增强普通文章 HTML；禁用 JS 时内容仍可读。
- **Code copy** 为生成的代码块添加增强交互。
- **Dia** 由 `dia.enabled`、`dia.locale` 和可选 `dia.tips` 配置；Demo 内容保持确定性。

## Footer 与 feeds

`footer.statistics.page_views` 和 `unique_visitors` 是手动展示字符串，不是实时统计。`site.started_date` 用于计算运行天数；`footer.beian` 可选。

根部署会生成 `/rss.xml`、`/cn/rss.xml`、`/sitemap.xml` 和 `/robots.txt`，并统一使用 `site.url` 与 `site.base`；构建环境中的 `ASTRO_SITE`/`ASTRO_BASE` 可覆盖它们。GitHub Pages Demo 的路径是 `/astro-theme-aurora/demo/rss.xml`、`/astro-theme-aurora/demo/cn/rss.xml`、`/astro-theme-aurora/demo/sitemap.xml` 和 `/astro-theme-aurora/demo/robots.txt`。两份 RSS 各自只含对应语言。普通构建排除 Demo 内容；公开条目可用 frontmatter `rss: false` 和 `sitemap: false` 分别退出对应索引。

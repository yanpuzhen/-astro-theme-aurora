# 域名与 Base 路径

Aurora 使用两个独立值：**源站**（`site.url` 或 `ASTRO_SITE`）与**路径前缀**（`site.base` 或 `ASTRO_BASE`）。源站是没有路径、查询参数或片段的 HTTP(S) URL；base 为 `/` 或以 `/` 开头和结尾的安全路径。不要在两者中重复填写 `/blog/`。

| 公开地址 | 源站 / `ASTRO_SITE` | Base / `ASTRO_BASE` |
| --- | --- | --- |
| `https://example.com/` | `https://example.com` | `/` |
| `https://blog.example.com/` | `https://blog.example.com` | `/` |
| `https://example.com/blog/` | `https://example.com` | `/blog/` |
| `https://username.github.io/my-blog/` | `https://username.github.io` | `/my-blog/` |

例如，`https://example.com/blog/` **不能**写成 `site.url: https://example.com/blog/`，这会违反只允许源站的校验。应设置 `site.url: https://example.com` 与 `site.base: /blog/`，或使用等效环境变量。嵌套 base 必须首尾都有斜杠；`/blog` 会校验失败。不要包含空格、重复斜杠、查询/片段文字或 `.`/`..` 路径段。

这一组合影响生成的链接、规范与替代语言 URL、本地资源、Pagefind 结果路径、RSS 条目、Sitemap 以及 robots.txt 中的绝对 Sitemap 指令。自定义域名如果部署在根路径，通常要改源站并把 base 设为 `/`；修改后重新构建。按托管商官方流程配置 DNS 和域名所有权，再验证真实 HTTPS 地址。预览部署应有意保持生产规范源站，或使用隔离的预览配置；不要意外把预览地址发布为规范 URL。

**路径变化可能改变评论身份。** giscus 的 `pathname` 会把 `/post/example/` 与 `/my-blog/post/example/` 映射到不同 Discussions。改变 permalink 或语言路径也可能如此。迁站前检查真实服务商记录；参见 [giscus 映射](/cn/comments/giscus)与 [Gitalk 迁移](/cn/comments/gitalk-migration)。

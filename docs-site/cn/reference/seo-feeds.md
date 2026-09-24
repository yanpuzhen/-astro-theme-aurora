# SEO、RSS、Sitemap 与 Robots

Aurora 在 `pnpm build` 时生成静态元数据与发现文件。构建前将 `site.url` 设为生产源站、`site.base` 设为部署路径；`ASTRO_SITE` 和 `ASTRO_BASE` 可覆盖。源站或 base 错误时，即使 HTML 能打开，规范 URL 和 Feed URL 仍可能错误。

| 根路径下的资源 | 用途 |
| --- | --- |
| `/rss.xml` | `rss` 启用的公开英文文章。 |
| `/cn/rss.xml` | `rss` 启用的公开中文文章。 |
| `/sitemap.xml` | 规范站点路由与 `sitemap` 启用的公开内容。 |
| `/robots.txt` | 允许抓取并提供绝对 Sitemap URL。 |

部署在 `/my-blog/` 时，以上所有路径都要加此前缀。草稿、隐藏、未发布以及普通构建排除的 Demo 文章不会进入公开路由和 Feed。`rss: false`、`sitemap: false` 分别只从一种资源排除公开文章。Sitemap 开关不会添加 `noindex`；不要用它隐藏机密内容。公开页面进入 Sitemap，但不是 RSS 条目。

每页输出规范 URL、可用时的描述、OpenGraph/Twitter 元数据和 JSON-LD。文章还有作者、日期、标签信息。页面 `keywords` 覆盖站点 `seo.keywords`；页面描述和封面有助于分享卡片。真实翻译配对会输出替代语言链接；未配对页面不会声称存在翻译。HTML 同时声明两个 RSS 路由。部署后请请求四种资源并检查绝对 URL，尤其是在自定义域名或 base 改动后。

# 基础配置

Aurora 3.0 从 `ASTRO_SITE` 和 `ASTRO_BASE` 读取公开站点地址与部署前缀，静态默认配置位于 `src/lib/config.ts`。

| 配置 | 来源 | 说明 |
| --- | --- | --- |
| `site` | `ASTRO_SITE` | 用于 canonical、OpenGraph、RSS、sitemap 和 JSON-LD 的公开 origin。 |
| `base` | `ASTRO_BASE` | project site 或嵌套部署的路径前缀，使用结尾斜杠。 |
| title | `config.site.title` | 站点和浏览器标题，目前为 `Aurora 3.0`。 |
| description | `config.site.description` | 页面默认 description。 |
| author | `config.site.author` | 页脚作者和默认作者 fallback。 |
| locale | `PUBLIC_AURORA_LOCALE` | 静态标签使用 `en` 或 `zh-CN`。 |
| feature section | `config.theme.feature` | 开启当前的精选文章排序逻辑。 |

示例：

```sh
ASTRO_SITE=https://yanpuzhen.github.io \
ASTRO_BASE=/-astro-theme-aurora/demo/ \
PUBLIC_AURORA_LOCALE=en \
pnpm build
```

首页精选模式使用 12 篇，非精选模式使用 13 篇；归档使用 12 篇。这些是 Aurora 3 RC 当前实现中的常量，不是环境变量。

Demo 使用独立构建，不要求 OAuth 或评论服务。

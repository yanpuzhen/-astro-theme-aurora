# 环境变量

非空环境变量在构建时读取，并覆盖对应 `_config.yml` 值。修改部署变量后需要重新构建。变量名以 `.env.example` 为准；不用的可选项留空。不要提交真实 `.env` 文件。

## 常规部署覆盖

| 变量 | 覆盖字段 | 用途 |
| --- | --- | --- |
| `ASTRO_SITE` | `site.url` | 只填 HTTP(S) 规范源站，例如 `https://example.com`。 |
| `ASTRO_BASE` | `site.base` | 根路径 `/` 或 `/my-blog/` 等安全且首尾有斜杠的路径。 |
| `PUBLIC_AURORA_TITLE`、`SUBTITLE`、`AUTHOR`、`DESCRIPTION` | 对应 `site.*` | 公开站点元数据。 |
| `PUBLIC_AURORA_LOCALE`、`AVATAR`、`LOGO`、`STARTED_DATE` | `site.language`、`avatar`、`logo`、`started_date` | 公开外观和元数据。 |
| `PUBLIC_AURORA_DIA` | `dia.enabled` | 明确的 true/false 字符串。 |
| `PUBLIC_AURORA_PAGE_VIEWS`、`UNIQUE_VISITORS` | `footer.statistics.*` | 手工显示值，不是实时分析。 |
| `PUBLIC_AURORA_BEIAN_NUMBER`、`BEIAN_LINK`、`POLICE_BEIAN_NUMBER`、`POLICE_BEIAN_LINK` | `footer.beian.*` | 公开备案文字和链接。 |

上表每个完整变量名都带 `PUBLIC_AURORA_` 前缀，例如头像变量是 `PUBLIC_AURORA_AVATAR`。空值不会覆盖 YAML。

## 公开服务商覆盖

| 变量 | 覆盖字段 |
| --- | --- |
| `PUBLIC_COMMENT_PROVIDER` | `comments.provider` |
| `PUBLIC_VALINE_APP_ID`、`PUBLIC_VALINE_APP_KEY` | `comments.valine.app_id`、`app_key` |
| `PUBLIC_TWIKOO_ENV_ID`、`PUBLIC_TWIKOO_REGION` | `comments.twikoo.env_id`、`region` |
| `PUBLIC_WALINE_SERVER_URL` | `comments.waline.server_url` |

Giscus 的公开仓库和分类标识在 `_config.yml` 设置。静态构建中的所有 `PUBLIC_*` 值都可能被浏览器看到。不要放密码、数据库 URL、GitHub PAT、OAuth 密钥或管理凭据。Waline/Twikoo 服务端密钥放在各自后端部署；Valine 的公开客户端 key 不是 LeanCloud Master Key。

## 构建与测试控制

| 变量 | 作用 |
| --- | --- |
| `ASTRO_DEMO_BUILD` | `true` 时仅选择 `demo: true` 的 Showcase 内容；普通构建会排除。 |
| `ASTRO_CONFIG_FILE` | 测试或有意使用专门配置时指定替代配置文件。 |
| `ASTRO_PREFLIGHT_TESTS` | 内部预检 fixture 控制。 |
| `ASTRO_PATH_SLUG` | 旧版路由测试/兼容模式（`uid`）；用户站优先使用显式 frontmatter。 |
| `PLAYWRIGHT_ORIGIN`、`PLAYWRIGHT_BASE_PATH`、`PLAYWRIGHT_PAGES` | 浏览器测试目标和模式，不是站点配置。 |

项目站可使用 `ASTRO_SITE=https://username.github.io ASTRO_BASE=/my-blog/ pnpm build`。[域名与 Base 路径](/cn/deploy/domains-and-base)说明这些值对规范 URL 和 Feed 的影响。

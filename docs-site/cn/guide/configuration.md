# 配置指南

在仓库根目录编辑 `_config.yml`。Aurora 在每次开发或生产构建时读取它。先设置 `site.title`、`site.author` 和最终部署地址；评论服务准备好之前保持 `comments.provider: none`。用 `pnpm dev` 查看效果，发布前运行 `pnpm build`。

## 配置如何生效

优先级是 **环境变量覆盖 → `_config.yml` → Aurora 默认值**。Aurora 解析 YAML，针对迁移场景规范化部分 Aurora 2 配置，应用构建期环境变量覆盖，再用 Zod 验证当前配置并补全默认值，供站点使用。因此，`ASTRO_BASE` 等环境变量可能让 YAML 修改看起来没有生效；删除或修改覆盖值后重新构建。

缺少 `_config.yml` 时使用默认值。YAML 格式错误、未知的当前配置键或非法值会让构建失败，并提示具体字段路径。布尔值写成 `true`/`false`，日期和 `#` 颜色建议加引号。完整字段、类型、默认值和限制见[基础配置](/cn/configs/general)；部署变量见[环境变量](/cn/reference/environment)。

## 安全的起始配置

这个完整示例没有启用外部服务。部署前请替换示例域名。

```yaml
site:
  title: My Aurora Blog
  subtitle: Notes and projects
  author: Your Name
  description: A personal blog.
  avatar: ''
  logo: /favicon.svg
  language: en
  started_date: ''
  url: https://example.com
  base: /
i18n:
  default_locale: en
  locales: [en, zh-CN]
theme:
  feature: true
  dark_mode: true
  profile_shape: diamond
  gradient: { color_1: '#24c6dc', color_2: '#5433ff', color_3: '#ff0099' }
menu: { home: true, tags: true, categories: true, archives: true, about: true, links: false }
socials: []
comments:
  provider: none
dia: { enabled: false, locale: auto, tips: [] }
footer:
  show_version: true
  show_avatar: true
  statistics: { page_views: '', unique_visitors: '' }
  beian: { number: '', link: '', police_number: '', police_link: '' }
links: []
seo: { keywords: [] }
```

`provider` 为 `none` 时可省略服务商专属配置；需要时再加入所选服务商的区块。切换前先[选择评论系统](/cn/comments/)并完成其部署指南。

## 常用配置

| 目标 | 修改方式 |
| --- | --- |
| 中文优先发布 | 文章设置 `lang: zh-CN`，引导读者访问 `/cn/`。`site.language: zh-CN` 是回退设置；英文仍是无前缀默认路由。见[国际化](/cn/guide/internationalization)。 |
| 头像和 Logo | `site.avatar`、`site.logo` 使用 `public/` 下的文件路径（如 `/images/avatar.png`）或绝对 HTTP(S) URL。 |
| 友链 | 在 `links` 添加条目，再设置 `menu.links: true`。 |
| 社交链接 | 在 `socials` 添加 `{ label: GitHub, href: 'https://github.com/example', icon: github }` 等记录。 |
| 运行天数 | 设置 `site.started_date: '2024-01-01'`；必须是真实日期。 |
| 备案信息 | 设置 `footer.beian.number`/`link`，按需设置 `police_number`/`police_link`。 |
| Dia | 设置 `dia.enabled: true`；`tips` 可填写简短提示列表。 |
| 根域名 | 设置 `site.url: https://example.com` 与 `site.base: /`。 |
| GitHub 项目站 | 设置 `site.url: https://username.github.io` 与 `site.base: /my-blog/`。 |

各平台可在构建时使用 `ASTRO_SITE` 和 `ASTRO_BASE`。`site.url` 只填源站，路径放在 `site.base`；见[域名与 Base 路径](/cn/deploy/domains-and-base)。静态配置中不要存放密码、数据库 URL 或评论服务端密钥。

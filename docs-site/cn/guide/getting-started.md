# 开始使用

## 环境要求

- Node.js 22.13 或更高版本
- pnpm 11.19 或更高版本
- 本仓库的 Git 工作副本

## 克隆与安装

```sh
git clone https://github.com/yanpuzhen/astro-theme-aurora.git
cd astro-theme-aurora
pnpm install --frozen-lockfile
```

## 开发与预览

日常主题设置请编辑仓库根目录的 `_config.yml`，包括站点标题、作者、主题、菜单、社交链接、评论、页脚、友链和 SEO。普通使用不需要编辑 `src/lib/config.ts`。构建期间会解析并校验 YAML。优先级为 **环境变量覆盖 > `_config.yml` > Aurora 默认值**。缺少配置文件时会使用默认值；YAML 格式或字段值无效会让构建失败。

稳定部署时，可以在 `_config.yml` 中设置公开 origin 和 base。CI 或平台构建仍可使用环境变量覆盖：

```sh
ASTRO_SITE=https://example.com ASTRO_BASE=/blog/ pnpm build
```

运行 Aurora 站点：

```sh
pnpm dev
```

文档站点使用独立的 VitePress server：

```sh
pnpm docs:dev
```

预览生产式静态输出：

```sh
pnpm build
pnpm preview
pnpm docs:build
pnpm docs:preview
```

## 创建第一篇文章

在 `src/content/posts/` 下创建 Markdown 文件。文件名是默认 slug。可用 `slug` 或 `permalink` 改变 URL；`permalinkMode: uid` 才会有意选用旧 UID 路径。最小文章如下：

```md
---
title: 我的第一篇 Aurora 文章
date: '2026-09-20'
---

使用 Markdown 写作。
```

页面放在 `src/content/pages/`。已有的 `about.md` 对应 `/about/`；其他页面条目对应 `/page/<id>/`，可以从正文等位置链接；内置菜单开关不会添加自定义页面。

根部署使用 `/`。GitHub Pages project site 的 base 必须包含仓库前缀和结尾斜杠。站内链接、RSS、sitemap 和 robots URL 都由同一份规范化配置组合。操作流程见[配置指南](/cn/guide/configuration)，全部字段与校验规则见[基础配置](/cn/configs/general)。

## 后续步骤

1. 阅读[配置指南](/cn/guide/configuration)和[撰写文章与页面](/cn/guide/writing-content)。
2. 如需评论，先选择[评论系统](/cn/comments/)并部署外部服务。
3. 在 [Vercel、Cloudflare Pages 或 GitHub Pages](/cn/deploy/)中选择平台，设置生产源站与 base。
4. 部署后检查 [SEO 与 Feed](/cn/reference/seo-feeds)及[故障排查](/cn/reference/troubleshooting)。

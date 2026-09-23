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

在 `src/content/posts/` 下创建 Markdown 文件。没有显式 frontmatter 时，文件名会成为默认 slug；也可以使用 `slug`、`permalink` 或兼容旧站的 UID。最小文章如下：

```md
---
title: 我的第一篇 Aurora 文章
date: 2026-09-20
---

使用 Markdown 写作。
```

页面放在 `src/content/pages/`。已有的 `about.md` 对应 `/about/`；其他页面条目对应 `/page/<id>/`，可以从菜单链接。

根部署使用 `/`。GitHub Pages project site 的 base 必须包含仓库前缀和结尾斜杠。站内链接、RSS、sitemap 和 robots URL 都由同一份规范化配置组合。字段和校验规则见[基础配置](/cn/configs/general)。

## GitHub Pages Demo

公开 Demo 使用：

```sh
pnpm demo:build
```

它使用 `https://yanpuzhen.github.io` 作为 `ASTRO_SITE`，使用 `/astro-theme-aurora/demo/` 作为 `ASTRO_BASE`。随后 `pages:build` 会把 Demo 放到 VitePress 文档输出的 `demo/` 下，形成一个 Pages artifact。

Demo 构建只选择 `demo: true` 的条目。迁移 fixtures 仍用于回归测试，但不会发布到 Demo。

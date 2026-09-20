# 开始使用

## 环境要求

- Node.js 22.13 或更高版本
- pnpm 11.19 或更高版本
- 本仓库的 Git 工作副本

## 克隆与安装

```sh
git clone https://github.com/yanpuzhen/-astro-theme-aurora.git
cd -astro-theme-aurora
pnpm install --frozen-lockfile
```

## 开发与预览

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

## Site 与 base

在构建时设置公开域名和部署前缀：

```sh
ASTRO_SITE=https://example.com ASTRO_BASE=/blog/ pnpm build
```

根部署使用 `/`。GitHub Pages project site 必须包含仓库前缀和结尾斜杠。所有站内链接和生成资源都会基于这个值组合。

## GitHub Pages Demo

公开 Demo 使用：

```sh
pnpm demo:build
```

它使用 `https://yanpuzhen.github.io` 作为 `ASTRO_SITE`，使用 `/-astro-theme-aurora/demo/` 作为 `ASTRO_BASE`。随后 `pages:build` 会把 Demo 放到 VitePress 文档输出的 `demo/` 下，形成一个 Pages artifact。

Demo 构建只选择 `demo: true` 的条目。迁移 fixtures 仍用于回归测试，但不会发布到 Demo。

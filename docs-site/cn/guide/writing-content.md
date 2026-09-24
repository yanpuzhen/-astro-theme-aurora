# 撰写文章与页面

Aurora 从 `src/content/posts/` 和 `src/content/pages/` 构建 Markdown 文件。每个文件的 frontmatter 都需要 `title` 和 `date`，正文使用普通 Markdown。图片放在 `public/images/`，用 `/images/name.png` 引用；Aurora 会为本地 Markdown 资源组合部署 base。写作时运行 `pnpm dev`，发布前运行 `pnpm build` 检查 frontmatter 和路由冲突。

## 第一篇文章

创建 `src/content/posts/hello.md`：

```md
---
title: Hello Aurora
date: '2026-09-24'
description: My first post.
tags: [notes]
---

# Hello

This is my first post. ![Example](/images/example.png)
```

默认英文 URL 是 `/post/hello/`；`slug` 可以改变末尾路径段。只有公开文章进入列表。设置 `draft: true`、`hidden: true` 或 `published: false` 会让文章不生成公开路由、Feed 和 Sitemap。`rss: false` 只排除 RSS；`sitemap: false` 只排除 Sitemap，**不是**隐私或 `noindex` 开关。

## 页面

创建 `src/content/pages/projects.md`，同样填写必需的 `title` 和 `date`，然后访问 `/page/projects/`。`about.md` 是内置的 `/about/` 页面。自定义页面可以从 Markdown 或其他导航位置链接；固定的 `menu` 开关不会生成自定义菜单项。页面不进入 RSS。全部字段见 [Frontmatter](/cn/reference/frontmatter)，渲染能力见 [Markdown](/cn/configs/markdown)。

## 翻译与 URL

英文和中文分别创建文件，并使用相同的 `translationKey`。中文条目设置 `lang: zh-CN`；省略语言时默认为英文。中文路由带 `/cn/`，语言切换器会链接到配对条目。迁移时有意保留 `slug`、`permalink`、`uid`/`legacyUid` 和评论身份。`permalink` 决定路由；`translationKey` 只用于配对内容。参见[国际化](/cn/guide/internationalization)和 [Frontmatter](/cn/reference/frontmatter)。

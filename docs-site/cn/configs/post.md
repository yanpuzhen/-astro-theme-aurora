# 文章

文章是 `src/content/posts/` 下的 Markdown 条目，由 `src/content.config.ts` 的 Content Collection schema 校验。

## Frontmatter 参考

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 必填。 |
| `date` | date | 必填，用于排序和 Meta。 |
| `updated` | date | 可选的修改时间。 |
| `tags`、`categories` | string 或 string[] | 会归一化为列表；分类可以包含 `/`。 |
| `cover` | string | 可选封面路径/URL。 |
| `description`、`excerpt`、`abstracts` | string | 描述和摘要 fallback。 |
| `keywords` | string 或 string[] | SEO keywords。 |
| `author` | string 或 object | 支持 name、slug、avatar、link、description、socials。 |
| `slug` | string | 可选 slug 覆盖。 |
| `permalink` | string | 显式 canonical 路径。 |
| `permalinkMode` | `slug`、`uid` 或 `explicit` | 选择路由策略。 |
| `uid`、`legacyUid` | string | 保留评论/历史 identity。 |
| `comments`、`comment` | boolean-like | 是否为文章启用 provider。 |
| `commentId`、`commentPath` | string | provider identity 覆盖。 |
| `sticky`、`pinned`、`feature` | boolean-like | 首页排序控制。 |
| `photos` | string[] | 由归一化层保留的图片路径。 |
| `toc` | boolean 或 string | 开启标题目录。 |
| `lang` | string | HTML 和 Pagefind 语言，如 `en` 或 `zh-CN`。 |
| `published`、`draft`、`hidden` | boolean-like | 公开性控制。 |

旧字段会在迁移适配器的 `extras` 中暂时保留；模板消费的是归一化后的类型。

## 最小示例

```md
---
title: 一篇 Aurora 文章
date: '2026-09-20'
---
文章正文使用 Markdown。
```

## 扩展与自定义 permalink

```md
---
title: 路由与部署
date: '2026-09-20'
updated: '2026-09-21'
slug: routing-deployment
permalink: /guides/routing-deployment/
tags: [routing, deployment]
categories: engineering/web
cover: /images/deployment.svg
description: 一篇部署说明。
lang: zh-CN
comments: false
---
```

公开 Demo 同时包含中文、英文、代码、图片和自定义 permalink 示例。

全部受支持字段与公开内容条件见 [Frontmatter](/cn/reference/frontmatter)。

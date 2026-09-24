# Frontmatter 参考

`src/content/posts/` 中的文章和 `src/content/pages/` 中的页面共用 Astro 内容 schema。`title`（非空字符串）和 `date`（可解析日期）必填。YAML 中请给 ISO 日期加引号。Schema 接受迁移字段；未知额外字段会作为元数据保留，但 Aurora 不赋予它们行为。

| 字段 | 值；默认值 | 效果 |
| --- | --- | --- |
| `title`、`date` | 字符串、日期；必填 | 显示标题和发布日期；精确标题可能影响生成的旧 UID。 |
| `updated` | 日期；无 | 更新日期元数据。 |
| `description`、`excerpt`、`abstracts` | 字符串；无 | 描述和摘要；`abstracts` 是 `excerpt` 的旧版回退。 |
| `preview` | 数字；无 | 提供时用作 RSS 摘要长度。 |
| `tags`、`categories`、`keywords` | 字符串或字符串列表；空 | 标签、分类和页面关键词。 |
| `cover` | 字符串或字符串列表；无 | 使用第一个封面值。 |
| `author` | 字符串或对象；Aurora 回退值 | 可选姓名、slug、头像、链接、描述和社交链接。 |
| `feature`、`sticky`、`pinned` | 类布尔值；false | 精选与置顶标记；`sticky` 是 `pinned` 的回退。 |
| `slug` | 字符串；文件名 ID | 默认 `/post/<slug>/` 路由末段。 |
| `permalink` | 字符串；无 | 显式文章规范路径，优先于 slug/UID 模式。 |
| `permalinkMode` | `slug`、`uid`、`explicit`；`slug` | 路由模式；`uid` 使用旧 UID。`explicit` 需要有效 `permalink`。 |
| `uid`、`legacyUid` | 字符串；按精确标题生成 | 稳定旧版身份输入；同时存在时优先 `legacyUid`。 |
| `legacyPermalink`、`legacyPermalinks`、`aliases` | 字符串或列表；空 | 兼容路径与跳转；重复或保留路由会构建失败。 |
| `photos` | 字符串列表；空 | 迁移后保留的旧版图片列表。 |
| `toc` | 布尔或字符串；false | 存在标题时显示文章目录。 |
| `comment`、`comments` | 类布尔值；true | 单篇评论开关；`comment` 优先。 |
| `commentId`、`commentPath` | 字符串；自动生成 | 迁移用评论 ID/路径覆盖；应与真实服务商记录核对。 |
| `lang` | 字符串；`en` | 内容语言；使用 `en` 或 `zh-CN`。 |
| `translationKey` | 字符串；无 | 配对翻译内容，用于切换及替代语言链接。 |
| `hidden`、`draft`、`published` | 类布尔值；false、false、true | 公开内容条件；隐藏、草稿、未发布内容不生成公开路由。 |
| `rss`、`sitemap` | 类布尔值；true、true | 决定公开文章进入 RSS/Sitemap；页面不进入 RSS。排除 Sitemap 不是 `noindex`。 |
| `demo` | 类布尔值；false | 专用 Showcase 内容；普通构建排除。 |
| `rawHtml`、`allowHtml` | 类布尔值；true | 旧版元数据；可执行原始 HTML 仍由 Markdown 安全流程删除。 |
| `type`、`categoryMode`、`data` | 字符串、字符串、任意值；无 | 接受用于迁移的旧版元数据；不是通用路由开关。 |

“类布尔值”可接受布尔、字符串或数字，并识别常见真假写法；建议使用 YAML 布尔值。构建后的 `route-manifest.json` 记录规范路径、兼容别名与评论字段。改变 slug 或部署 base 可能改变基于 pathname 的评论匹配；`translationKey` 不改变身份。

## 示例

最小文章：

```md
---
title: A first post
date: '2026-09-24'
---

Hello Aurora.
```

带自定义路径和迁移身份的完整文章：

```md
---
title: Release notes
date: '2026-09-24'
updated: '2026-09-25'
description: What changed this week.
slug: release-notes
permalink: /notes/releases/
legacyUid: stable-old-id
legacyPermalinks: [/post/old-release/]
tags: [release, notes]
categories: [Journal]
cover: /images/release.png
feature: true
pinned: true
toc: true
comments: true
rss: true
sitemap: true
---

The content goes here.
```

翻译配对：创建两个文件，分别设置 `lang: en` 与 `lang: zh-CN`，都填写 `translationKey: welcome`。标题和 slug 可以不同，中文路由会加 `/cn/`。草稿设置 `draft: true`，发布前删除。公开文章可分别用 `rss: false`、`sitemap: false` 排除对应资源。`src/content/pages/projects.md` 中的页面可填写 `title: Projects`、`date: '2026-09-24'` 和普通 Markdown，URL 为 `/page/projects/`。

英文文件 `src/content/posts/welcome-en.md`：

```md
---
title: Welcome
date: '2026-09-24'
lang: en
translationKey: welcome
slug: welcome
---

Welcome to the blog.
```

中文文件 `src/content/posts/welcome-zh.md`：

```md
---
title: 欢迎
date: '2026-09-24'
lang: zh-CN
translationKey: welcome
slug: huan-ying
---

欢迎来到博客。
```

页面 `src/content/pages/projects.md`：

```md
---
title: Projects
date: '2026-09-24'
description: Things I made.
---

My projects.
```

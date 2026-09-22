---
title: 表格、列表、引用与复杂文档
date: 2026-09-15
demo: true
slug: demo-rich-markdown-cn
permalink: /post/demo-rich-markdown/
translationKey: demo-rich-markdown
lang: zh-CN
cover: https://picsum.photos/seed/aurora-demo-06/1600/900
tags: [Markdown, Astro, 设计, 静态站点]
categories: [Markdown, 设计]
description: 展示表格对齐、任务列表、嵌套引用、容器和 GFM 文档细节。
keywords: [极光搜索测试, 复杂文档, 静态博客]
toc: true
comments: false
---

这是一篇用于展示 AuroraSearchAlpha 的复杂 Markdown 文档。

## 数据表格

| 能力 | 渲染器 | 输出 |
| :--- | :---: | ---: |
| 静态路由 | Astro | HTML |
| 搜索 | Pagefind | 索引 |
| 样式 | Aurora | 光芒 |

## 任务与嵌套引用

- [x] 让正文存在于静态 HTML
- [x] 对生成页面建立索引
- [ ] 使用运行时渲染正文

> 第一原则是让内容可读。
>
> > 嵌套引用仍然是引用。
>
> 它也可以包含一个 [有用的链接](https://docs.astro.build/)。

1. 混合列表
   - 嵌套无序内容
   - 另一个列表项
2. 第二个有序项

:::tip
Aurora 容器会被转换为带有主题 class 的语义 blockquote。
:::

:::warning
Markdown 中的脚本会被移除；需要媒体时仍可使用安全的普通 HTML。
:::

<details>
<summary>实现说明</summary>

整篇内容由单一的 Astro → Remark → Rehype → Shiki 管线生成。
</details>

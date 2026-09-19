---
title: "迁移后的第一篇文章 🚀"
date: 2026-09-18
updated: 2026-09-19
tags: migration
categories: [Aurora, compatibility]
legacyUid: legacy-fixture-uid-001
permalink: /legacy/custom-route/
cover: https://images.example.test/aurora-cover.jpg
description: "覆盖历史 Aurora frontmatter 的中文兼容 fixture。"
excerpt: "这篇文章验证中文标题、emoji、自定义 permalink、评论 identity 和旧字段归一化。"
lang: zh-CN
keywords: [Aurora, Astro, 迁移]
author:
  name: Aurora Team
  slug: aurora-team
  link: https://example.com/team
comment: true
commentPath: /post/legacy-compatibility/
photos:
  - https://images.example.test/photo-1.jpg
---

# 迁移后的第一篇文章

这是一篇来自 Aurora 旧字段形状的最小兼容 fixture。它包含一个 [站内链接](/post/architecture-smoke/) 和一个 [外部链接](https://astro.build/)。

:::tip
迁移后的 Markdown 仍然可以使用 Aurora 的提示容器语法。
:::

> 旧文章的正文必须在构建后的 HTML 中直接存在。

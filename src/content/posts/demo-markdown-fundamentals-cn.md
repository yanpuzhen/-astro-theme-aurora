---
title: Aurora Markdown 基础语法测试
date: 2026-09-20
demo: true
slug: demo-markdown-fundamentals-cn
permalink: /post/demo-markdown-fundamentals/
translationKey: demo-markdown-fundamentals
lang: zh-CN
cover: https://picsum.photos/seed/aurora-demo-02/1600/900
tags: [Aurora, Astro, Markdown, 静态站点]
categories: [指南, Markdown]
description: 用静态 HTML 展示 CommonMark 与 GFM 的完整基础语法。
keywords: [极光搜索测试, 静态博客, Markdown, GFM]
toc: true
comments: false
---

极光搜索测试是 Pagefind 的中文检索标记。静态博客正文在任何交互岛加载前就已经存在。

# 一级标题

## 标题与强调

这一段包含 *斜体*、**粗体**、***粗斜体***、~~删除线~~ 和 `行内代码`。  
这一行通过两个空格换行，并且包含一个 [Astro 外部链接](https://astro.build/)。

---

### 有序与无序列表

1. 阅读源文件。
2. 构建页面。
   1. Remark 解析 Markdown。
   2. Rehype 输出 HTML。
3. 打开结果。

- 一级列表项
  - 嵌套列表项
    - 更深一层的列表项
- 第二个列表项

#### 其余标题级别

##### 五级标题

###### 六级标题

完整语法矩阵见文档。Aurora 专注于 CommonMark、GFM 和少量明确支持的容器扩展。

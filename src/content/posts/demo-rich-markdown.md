---
title: Tables, Lists, Quotes and Rich Documents
date: 2026-09-15
demo: true
slug: demo-rich-markdown
translationKey: demo-rich-markdown
lang: en
cover: https://picsum.photos/seed/aurora-demo-05/1600/900
tags: [Markdown, Astro, Design, Static Site]
categories: [Markdown, Design]
description: Tables, alignment, task lists, nested quotes, containers, and document-level GFM details.
keywords: [AuroraSearchAlpha, rich markdown, static HTML]
toc: true
comments: false
---

This document is a practical rich Markdown surface for AuroraSearchAlpha.

## A data table

| Feature | Renderer | Output |
| :--- | :---: | ---: |
| Static routes | Astro | HTML |
| Search | Pagefind | Index |
| Styling | Aurora | Glow |

## Tasks and nested quotes

- [x] Keep article text in static HTML
- [x] Index the generated page
- [ ] Add runtime article rendering

> The first principle is readable content.
>
> > A nested quote remains a quote.
>
> It can contain a [useful link](https://docs.astro.build/).

1. A mixed list
   - with nested unordered content
   - and another item
2. A second ordered item

:::tip
Aurora containers are transformed into semantic blockquotes with a themed class.
:::

:::warning
Raw scripts are removed from Markdown; ordinary safe HTML remains available when needed for media.
:::

<details>
<summary>Implementation note</summary>

The single Astro → Remark → Rehype → Shiki pipeline owns this output.
</details>

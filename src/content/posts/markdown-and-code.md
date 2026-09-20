---
title: Markdown & Code
date: 2026-09-18
demo: true
tags: [Markdown, code, Shiki]
categories: authoring
description: Headings, tables, task lists, code metadata, and safe HTML in one readable example.
excerpt: A compact reference for the Markdown features supported by the current Aurora implementation.
keywords: [Markdown, Shiki, code copy]
lang: en
toc: true
comments: false
---

## A practical writing surface

Aurora supports headings, links, tables, task lists, blockquotes, images, and fenced code. The code block below also demonstrates a filename label and line highlighting.

- [x] Static HTML is readable before JavaScript loads.
- [x] Shiki highlights code at build time.
- [ ] Arbitrary Markdown scripts are intentionally inert.

```ts title="aurora.config.ts" {1,3}
const site = {
  title: 'Aurora 3.0',
  base: '/-astro-theme-aurora/demo/',
}

export default site
```

| Capability | Status |
| --- | --- |
| Tables and task lists | Supported |
| Shiki code highlighting | Supported |
| Raw HTML images | Supported |
| Arbitrary script execution | Disabled by default |

![Aurora gradient landscape](/demo/aurora-cover.svg)

Click the image to try Aurora's lightbox island.

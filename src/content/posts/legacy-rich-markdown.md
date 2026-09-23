---
rss: false
sitemap: false
title: Legacy Markdown parity
date: 2026-09-17
slug: legacy-markdown-parity
tags: [markdown, code, "中文"]
categories: engineering/frontend
sticky: true
published: true
description: Markdown parity fixture with code, tables, images and inert scripts.
toc: true
---

## Code and metadata

```ts {1} title="example.ts"
const greeting = 'Aurora';
console.log(greeting);
```

| Feature | Status |
| --- | --- |
| Static HTML | ready |
| Chinese search | ready |

<figure>
  <img src="/fixtures/aurora-placeholder.svg" alt="Inline fixture image" />
  <figcaption>Images remain usable without JavaScript.</figcaption>
</figure>

<script>alert('this must not execute')</script>

<a href="javascript:alert('this must not execute')" onclick="alert('this must not execute')">Unsafe link fixture</a>
<iframe src="https://example.invalid/unsafe"></iframe>

:::warning
The legacy post-render script is intentionally not restored.
:::

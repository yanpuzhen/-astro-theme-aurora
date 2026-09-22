---
title: Code, Syntax Highlighting and Developer Notes
date: 2026-09-18
demo: true
pinned: true
slug: demo-code-showcase
translationKey: demo-code-showcase
lang: en
cover: https://picsum.photos/seed/aurora-demo-03/1600/900
tags: [TypeScript, Python, Rust, Astro, Shiki]
categories: [Development, Guide]
description: Shiki code blocks with languages, filenames, titles, highlighted lines, and copy enhancement.
keywords: [StaticAstro, PagefindLocale, TypeScript, Python, Rust]
toc: true
comments: false
---

PagefindLocale is a search marker, while the code blocks below exercise the languages Aurora currently highlights with Shiki.

## Shell and JavaScript

```bash title="build.sh" {1,3}
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

```javascript filename="search.js" {2}
const query = 'AuroraSearchAlpha'
const result = await pagefind.search(query)
console.log(result)
```

## TypeScript, Python and Rust

```typescript title="src/lib/locale.ts" line-numbers {1,4}
export type Locale = 'en' | 'zh-CN'
export const baseFor = (locale: Locale) => locale === 'en' ? '/' : '/cn/'
```

```python
def matrix_formula(rows: list[list[int]]) -> int:
    return sum(sum(row) for row in rows)
```

```rust filename="main.rs"
fn main() {
    println!("StaticAstro");
}
```

## Data and web languages

```json title="site.json"
{"locale":"en","static":true,"search":"PagefindLocale"}
```

```yaml
site: Aurora
base: /demo/
```

```html
<article data-pagefind-body>Static HTML</article>
```

```css
.aurora { background: linear-gradient(130deg, #24c6dc, #ff0099); }
```

```astro
---
const title = 'Aurora'
---
<h1>{title}</h1>
```

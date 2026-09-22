---
title: 代码高亮与技术文档测试
date: 2026-09-18
demo: true
slug: demo-code-showcase-cn
permalink: /post/demo-code-showcase/
translationKey: demo-code-showcase
lang: zh-CN
cover: https://picsum.photos/seed/aurora-demo-04/1600/900
tags: [TypeScript, Python, Rust, Astro, Shiki]
categories: [开发, 指南]
description: 使用 Shiki 展示语言、文件名、标题、行高亮和复制增强。
keywords: [静态博客, 页面搜索, TypeScript, Python, Rust]
toc: true
comments: false
---

页面搜索是中文检索标记，下面的代码块覆盖 Aurora 当前由 Shiki 支持的常用语言。

## Shell 与 JavaScript

```bash title="build.sh" {1,3}
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

```javascript filename="search.js" {2}
const query = '极光搜索测试'
const result = await pagefind.search(query)
console.log(result)
```

## TypeScript、Python 与 Rust

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
    println!("静态博客");
}
```

## 数据与网页语言

```json title="site.json"
{"locale":"zh-CN","static":true,"search":"页面搜索"}
```

```yaml
site: Aurora
base: /cn/
```

```html
<article data-pagefind-body>静态 HTML</article>
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

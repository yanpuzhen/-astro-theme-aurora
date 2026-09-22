# Markdown

Astro's Markdown pipeline is the only renderer. The current implementation uses:

- Remark for Aurora containers and base-aware Markdown URLs.
- Rehype Raw for supported raw HTML, followed by base-path and code metadata transforms.
- Shiki for build-time syntax highlighting.
- `remark-gfm` for tables, task lists, strikethrough, and GFM autolinks.
- `remark-math` and `rehype-katex` for build-time inline and display math.

Supported and verified content includes headings, anchors, tables, task lists, blockquotes, images, links, fenced code, filename/title metadata, line numbers, line highlighting, and Aurora `tip`, `warning`, `danger`, and `details` containers.

```ts title="example.ts" {1}
const theme = 'Aurora'
```

Inline math uses `$E = mc^2$`; display math uses a fenced double-dollar block. KaTeX runs at build time, so generated equations remain readable with JavaScript disabled. Long displays scroll within their own container on small screens.

Raw HTML images are base-aware. Dangerous tags, event-handler attributes, unsafe URL schemes, and `<script>` elements are removed by default; arbitrary script execution is not a supported content feature. See the [showcase matrix](https://github.com/yanpuzhen/astro-theme-aurora/blob/dev/docs/review/MARKDOWN_DEMO_MATRIX.md) in the repository for the exact supported surface and fixture posts.

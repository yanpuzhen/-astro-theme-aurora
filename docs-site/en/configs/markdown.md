# Markdown

Astro's Markdown pipeline is the only renderer. The current implementation uses:

- Remark for Aurora containers and base-aware Markdown URLs.
- Rehype Raw for supported raw HTML, followed by base-path and code metadata transforms.
- Shiki for build-time syntax highlighting.

Supported and verified content includes headings, anchors, tables, task lists, blockquotes, images, links, fenced code, filename/title metadata, line numbers, line highlighting, and Aurora `tip`, `warning`, `danger`, and `details` containers.

```ts title="example.ts" {1}
const theme = 'Aurora'
```

Raw HTML images are base-aware. Markdown `<script>` elements are removed or made inert by default; arbitrary script execution is not a supported content feature. Math is not currently configured in Aurora 3 RC. Add a reviewed integration rather than enabling untrusted script or math execution globally.

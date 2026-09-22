# Markdown Demo Matrix

The Demo corpus is the executable fixture for this matrix. Rendering remains a
single Astro → Remark → Rehype → Shiki pipeline; Math is build-time KaTeX, not
a client-side parser.

| Syntax | Supported | Implementation | Demo post | Automated test | Notes |
| --- | --- | --- | --- | --- | --- |
| Headings | Yes | CommonMark/Astro | `demo-markdown-fundamentals` | `verify-demo` | H1–H6 |
| Paragraph and line break | Yes | CommonMark | `demo-markdown-fundamentals` | `verify-demo` | Two trailing spaces remain readable |
| Italic/bold/bold italic | Yes | CommonMark | `demo-markdown-fundamentals` | `verify-demo` | |
| Strikethrough | Yes | `remark-gfm` | `demo-markdown-fundamentals` | `verify-demo` | GFM |
| Inline code | Yes | CommonMark | `demo-markdown-fundamentals` | `verify-demo` | |
| Fenced code | Yes | Astro Shiki | `demo-code-showcase` | `verify-demo` | bash, JS, TS, Python, Rust, JSON, YAML, HTML, CSS, Astro |
| Syntax highlighting | Yes | Shiki | `demo-code-showcase` | `verify-demo` | Build-time |
| Filename/title/line metadata | Yes | Aurora Shiki transformer | `demo-code-showcase` | `verify-build` | Supported metadata only |
| Blockquote/nested blockquote | Yes | CommonMark | `demo-rich-markdown` | `verify-demo` | |
| Unordered/ordered/nested list | Yes | CommonMark | `demo-markdown-fundamentals` | `verify-demo` | |
| Task list | Yes | `remark-gfm` | `demo-rich-markdown` | `verify-demo` | |
| Table/alignment | Yes | `remark-gfm` | `demo-rich-markdown` | `verify-demo` | |
| Autolink/link | Yes | CommonMark/GFM | `demo-media` | `verify-demo` | External and locale-aware internal links |
| Image/title/alt text | Yes | CommonMark/raw HTML | `demo-media` | `verify-demo` | Remote bytes are not downloaded at build time |
| Horizontal rule/escape | Yes | CommonMark | `demo-markdown-fundamentals` | `verify-demo` | |
| Footnote | Not claimed | No plugin configured | None | None | Deliberately outside the current supported fixture set |
| Raw HTML | Bounded | `rehype-raw` + script removal | `demo-rich-markdown`, `demo-media` | `verify-build` | Media/details allowed; scripts are removed |
| Aurora containers | Yes | `remarkAurora` | `demo-rich-markdown` | `verify-demo` | `tip`, `warning`, `danger`, `details` |
| Inline math | Yes | `remark-math` + `rehype-katex` | `demo-math` | `verify-demo` | Build-time |
| Display math | Yes | `remark-math` + `rehype-katex` | `demo-math` | `verify-demo` | Overflow is isolated to the equation container |
| Matrix/aligned equations | Yes | KaTeX supported environments | `demo-math` | `verify-demo` | Valid KaTeX environments only |

The Demo uses `demo: true` for exactly ten primary posts. Ordinary `pnpm build`
uses `demo: false` compatibility content and does not publish Showcase fixtures,
fixture comments, links, profile data, or fixture statistics.

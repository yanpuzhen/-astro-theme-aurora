# Markdown

Astro Markdown pipeline 是唯一 renderer。当前实现使用：

- Remark 处理 Aurora containers 和 base-aware Markdown URL。
- Rehype Raw 支持安全范围内的 raw HTML，随后处理 base-path 和 code metadata。
- Shiki 在构建阶段进行语法高亮。
- `remark-gfm` 支持表格、任务列表、删除线和 GFM 自动链接。
- `remark-math` 与 `rehype-katex` 在构建阶段渲染行内和块级数学公式。

已经支持并验证的内容包括标题、锚点、表格、task list、blockquote、图片、链接、fenced code、文件名/title metadata、行号、行高亮，以及 Aurora `tip`、`warning`、`danger`、`details` 容器。

```ts title="example.ts" {1}
const theme = 'Aurora'
```

行内公式使用 `$E = mc^2$`，块级公式使用独立的双美元符号区块。KaTeX 在构建阶段运行，因此关闭 JavaScript 后生成的公式仍然可读；移动端的超长公式只会在公式容器内滚动。

Raw HTML 图片会自动处理 base。Markdown 中的危险标签、事件属性、不安全 URL 协议和 `<script>` 默认会被移除；任意脚本执行不是受支持的内容功能。完整支持矩阵见仓库中的 `docs/review/MARKDOWN_DEMO_MATRIX.md`。

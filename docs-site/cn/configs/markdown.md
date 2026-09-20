# Markdown

Astro Markdown pipeline 是唯一 renderer。当前实现使用：

- Remark 处理 Aurora containers 和 base-aware Markdown URL。
- Rehype Raw 支持安全范围内的 raw HTML，随后处理 base-path 和 code metadata。
- Shiki 在构建阶段进行语法高亮。

已经支持并验证的内容包括标题、锚点、表格、task list、blockquote、图片、链接、fenced code、文件名/title metadata、行号、行高亮，以及 Aurora `tip`、`warning`、`danger`、`details` 容器。

```ts title="example.ts" {1}
const theme = 'Aurora'
```

Raw HTML 图片会自动处理 base。Markdown 中的 `<script>` 默认会被移除或变为 inert；任意脚本执行不是受支持的内容功能。Aurora 3 RC 尚未配置 math。需要时应添加经过审查的集成，不要全局开启不受信任的 script 或 math 执行。

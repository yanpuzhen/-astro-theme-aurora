# 页面与导航

`src/content/pages/` 下的 Markdown 是自定义页面来源。`about.md` 渲染为 `/about/`；其他条目渲染为 `/page/<id>/`，可以从 Markdown 或其他导航位置链接。内置 `menu` 开关不会添加自定义页面。

公开文章会生成：

- `/tags/` 和 `/tags/<slug>/`
- `/categories/` 和 `/categories/<slug>/`
- `/archives/` 和分页归档页面
- `/search/`

自定义页面需要显式导航：从正文或其他导航位置链接生成路径。Aurora 3.0 没有 author 页面路由，也不支持旧的页面侧边栏 schema。

页面与文章共享静态 layout、Meta、base-path helpers、Markdown pipeline 和禁用 JavaScript 时可读的保证。

页面与文章一样，需要 `title` 和 `date` frontmatter。参见[撰写文章与页面](/cn/guide/writing-content)与 [Frontmatter](/cn/reference/frontmatter)。

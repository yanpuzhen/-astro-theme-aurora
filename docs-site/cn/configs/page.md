# 页面与导航

`src/content/pages/` 下的 Markdown 是自定义页面来源。`about.md` 渲染为 `/about/`；其他条目渲染为 `/page/<id>/`，可以从菜单链接。

公开文章会生成：

- `/tags/` 和 `/tags/<slug>/`
- `/categories/` 和 `/categories/<slug>/`
- `/archives/` 和分页归档页面
- `/search/`

自定义页面需要显式导航：在菜单中添加生成路径。当前 Aurora 3 RC 没有 author 页面路由，旧的页面侧边栏 schema 也尚未支持。

页面与文章共享静态 layout、Meta、base-path helpers、Markdown pipeline 和禁用 JavaScript 时可读的保证。

# 路由

`src/lib/routing.ts` 是唯一的公开路由解析层。文章链接、canonical、评论、分页卡片、别名和 route manifest 都使用它。

## 文章路径

- 默认：`/post/<slug>/`
- 显式 `permalink`：frontmatter 中规范化后的路径
- UID 模式：frontmatter 设置 `permalinkMode: uid` 后使用 `/post/<legacyUid>/`
- 兼容别名：适用时生成 `/post/<slug>.html` 以及已验证的 slug/UID 别名

默认 slug 来自内容文件名；`slug` 可覆盖它。`legacyUid` 或 `uid` 优先；如果都没有，Aurora 保留已审计的标题 hash 算法（文章使用 `post_uid___<title>`，页面使用 `page_uid___<title>`）。

## Base 路径

`ASTRO_BASE=/` 是根部署。GitHub Pages project site 使用完整项目路径：

```sh
ASTRO_BASE=/my-blog/
```

此时 `src/content/posts/hello.md` 的生成地址是 `/my-blog/post/hello/`。源站另设 `ASTRO_SITE=https://username.github.io`。见[域名与 Base 路径](/cn/deploy/domains-and-base)。

路由冲突、保留 taxonomy 路径和重复别名会让构建失败。静态 `route-manifest.json` 记录规范路径、别名、UID 和评论路径。

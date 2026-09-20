# 菜单

菜单是 `src/lib/config.ts` 中的类型化列表，每项包含 `label` 和 `href`：

```ts
menu: [
  { label: '首页', href: '/' },
  { label: '标签', href: '/tags/' },
  { label: '文档', href: 'https://yanpuzhen.github.io/astro-theme-aurora/' },
]
```

相对链接会自动组合 Astro 的 `base`，`https://` 外链保持原样。当前站点路由包含首页、标签、归档、关于、搜索、分类和自定义页面。

同一份菜单会传给 mobile menu island。小屏幕上，JavaScript 增强后桌面链接会隐藏；禁用 JavaScript 时，普通导航仍然可见并可用。

Aurora 3 RC 没有 runtime 菜单编辑器、Vue Router 或任意 Hexo 菜单 schema。需要自定义页面时，应指向 `src/content/pages/` 生成的路径。

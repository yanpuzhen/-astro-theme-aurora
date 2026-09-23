# 菜单

在 `_config.yml` 中用布尔值控制内置路由链接显示；标签和目标路径由 Aurora 本地化与维护：

```yaml
menu:
  home: true
  tags: true
  categories: true
  archives: true
  about: true
  links: false
```

桌面和移动导航使用相同的生成菜单。这些开关只隐藏/显示链接，不会删除对应路由。搜索通过搜索交互入口提供，不是菜单开关。友链数据单独放在顶层 `links` 数组。

Aurora 没有 runtime 菜单编辑器、任意 label/URL 列表、Vue Router 或 Hexo 菜单 runtime。自定义内容页放在 `src/content/pages/`；路由仍由静态实现生成。

# 社交链接

在 `_config.yml` 中配置站点级个人资料链接：

```yaml
socials:
  - label: GitHub
    href: https://github.com/your-name
    icon: github # github | link
  - label: Email
    href: mailto:you@example.com
    icon: link
```

当当前文章的旧 author frontmatter 没有社交链接时，侧栏使用这里的配置。已有作者 `socials` record 仍可迁移，但自定义 HTML 图标不会迁移。只允许 HTTP(S)、`mailto:` 和 `tel:` URL。Demo 个人资料是独立的确定性 fixture，不会继承站点配置。

友链卡片单独使用顶层 `links`：

```yaml
links:
  - name: Example
    url: https://example.org
    avatar: /images/example.png
    description: 一个有用的项目
    category: Projects
    color: '#5433ff'
```

最多支持 200 条。链接 URL 必须为绝对 HTTP(S)；头像可为空、站点根路径或 HTTP(S)。Demo 使用自己的分类 fixture。普通构建没有 `links` 时显示本地化空状态，不会虚构链接记录。

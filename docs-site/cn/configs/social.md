# 社交链接

作者 frontmatter 为迁移兼容保留了 `socials` record：

```yaml
author:
  name: Aurora Team
  link: https://example.com/team
  socials:
    github: https://github.com/yanpuzhen
```

侧栏会渲染作者身份、头像、简介和已配置的链接。Demo 构建使用明确的 `Aurora Demo` Profile，并提供 GitHub、文档和 Issues 目标；普通构建读取 frontmatter/配置，不会继承这些 fixture。

友链页面也遵循静态优先原则。公开 Demo 提供七条按项目/资源分类的记录；没有链接数据的普通构建保留本地化空状态，不会虚构外部记录。当前字段包括 `name`、`url`、`avatar`、`description`、`category` 和可选展示颜色。

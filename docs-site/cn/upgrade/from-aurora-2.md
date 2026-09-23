# 从 Aurora 2.x 迁移

Aurora 3 是静态 Astro 实现，不是对 Hexo runtime 的原地升级。请保留旧站点和 provider 记录，直到新 canonical URL 与评论 identity 完成比对。

## 迁移配置

将实际使用的配置概念复制到仓库根目录 `_config.yml`；日常设置不再编辑 `src/lib/config.ts`。优先级是**环境变量覆盖 > `_config.yml` > Aurora 默认值**。`ASTRO_SITE` 和 `ASTRO_BASE` 可用于部署覆盖。缺少 YAML 时使用默认值；非法规范配置会让构建失败。

| Aurora 2 概念 | Aurora 3 目标 | 兼容状态 |
| --- | --- | --- |
| `site.title/author/description/avatar/language` | `site.*` | 概念相同，字段规范化。 |
| `site.started_date` | `site.started_date` | 相同；也接受 `startedDate` 别名。 |
| `site.url/root` | `site.url` + `site.base` | 拆分 origin 与部署路径。 |
| `menu` 标题/URL 对象 | 布尔型 `menu` 开关 | 仅内置路由；不迁移自定义标题/目标。 |
| `socials` 对象 | `{ label, href, icon }` 列表 | 可映射的链接保留；不迁移自定义 HTML 图标。 |
| 根级 provider 区块 | `comments.provider` + `comments.<provider>` | 规范化选定的 camelCase 别名。 |
| `aurora_bot` | `dia` | 重命名并警告。 |
| `site.beian` / `police_beian` | `footer.beian` | 移动并警告。 |
| `site_meta` | `site` / `seo` | 部分映射并警告。 |
| `busuanzi` | 无 | 不包含统计后端。 |
| `authors`、`copy_protection`、`injects`、`footer_links`、旧 Shiki 设置 | 无 | 不支持；会通过警告说明。 |

示例：

```yaml
site:
  title: 我的博客
  author: 你的名字
  url: https://example.com
  base: /
comments:
  provider: waline
  waline:
    server_url: https://comments.example.com
```

### Gitalk 安全差异

Aurora 仅保留 Gitalk legacy UID/pathname identity 计算、aliases、Aurora 2 migration recognition 和历史数据映射。上游 Gitalk 1.8 的 OAuth/client 流程要求浏览器可见的 client secret。Aurora 3 刻意不暴露该 secret、不打包 Gitalk、不构建 OAuth 后端，也不 fork Gitalk。Aurora 2 根级 `gitalk.enable: true` 不会选择 provider；只规范化安全 identity 字段，并通过 warning 忽略或拒绝 runtime/credential 字段。canonical `comments.provider: gitalk` 会给出本地化配置错误，推荐 Waline 或 Twikoo。此 migration-only 定位已被接受，不是 Stable Preflight blocker。

## 内容与验证

1. 将文章复制到 `src/content/posts/`，页面复制到 `src/content/pages/`；检查通过前先保留旧 frontmatter。
2. 标题派生 UID 必须保留精确标题输入；空白或 Unicode 规范化改变都可能改变 ID。
3. 检查 custom permalink、`.html` alias 和 base-aware 资源路径。
4. 在 YAML 中配置 `site.url`/`site.base`，或用部署环境变量覆盖。
5. 切换流量前比较真实 provider ID/记录；测试 fixture 无法证明生产连续性。
6. 运行 `pnpm test`、`pnpm check`、`pnpm test:browser:preflight`、根路径及 nested-base 构建、`pnpm pages:build` 和 `pnpm test:pages`。

Astro 负责静态路由、内容、SEO、feeds 和 HTML。Vue Router、SPA 文章状态、runtime `/api/*.json`、统计后端、不安全的 Gitalk 静态 secret 流程及自动执行 Markdown script 均不属于 Aurora 3。

# 集成

日常集成配置写在 `_config.yml`。浏览器配置均为公开值，不要在 YAML 或 `PUBLIC_*` 环境变量中保存私密凭证。

## 评论

giscus、Waline、Twikoo 是一等运行时；Valine 保留为旧版运行时。`none` 关闭评论岛且不加载 provider 资源。Aurora 3 已移除 Gitalk 运行时选择，迁移方法见[升级指南](/cn/upgrade/from-aurora-2)。

### 配置 giscus

1. 在公开的 GitHub 仓库启用 Discussions，并为该仓库安装 [giscus GitHub App](https://github.com/apps/giscus)。
2. 在 [giscus.app](https://giscus.app) 获取仓库与分类 ID；分类需允许新建讨论。
3. 在 `_config.yml` 写入公开标识：

```yaml
comments:
  provider: giscus
  giscus:
    repo: example/blog-comments
    repo_id: R_example
    category: General
    category_id: DIC_example
    mapping: pathname
    term: ''
    strict: false
    reactions_enabled: true
    emit_metadata: false
    input_position: bottom
    theme: auto
    lang: auto
    loading: eager
```

自动创建 Discussion 时必须填写 `repo`、`repo_id` 和 `category_id`。`mapping: number` 用正整数 `term` 指定已有 Discussion，可不填 `category_id`；`mapping: specific` 则要求非空 `term`。还支持 `url`、`title`、`og:title`。默认的 `pathname` 使用浏览器实际部署路径：`ASTRO_BASE`、自定义永久链接或语言路由变化都可能映射到不同 Discussion。迁移旧评论时，可在核对转换后标题的基础上用 `specific` 与 `term: "{legacyUid}"` 取得逐页稳定 UID；字面量 term 会让所有页面共用一个讨论。全局 `number` 也会让所有页面指向同一个 Discussion；不会自动匹配 Gitalk Issue。

`theme: auto` 跟随 Aurora 的 Light/Dark/System 切换，无需刷新页面。可显式选 `light`、`dark`、`dark_dimmed`；不接受任意 CSS URL。`lang: auto` 把路由映射为 `en` 或 `zh-CN`，也可显式设置这两种语言。评论岛已在可见时 hydration，所以内部默认 `loading: eager`；仍可选 `lazy`。giscus iframe 由 giscus.app 托管，GitHub 授权由 giscus 处理，不需要站点 OAuth 密钥或 PAT。若使用 CSP，需允许 giscus.app 的 frame 及 giscus 所需连接；Aurora CSS/DOM 无法控制 iframe 内部。

### 其他 provider 与能力

| Provider | 定位 | 客户端 | 最新评论 | 生产后端 |
| --- | --- | --- | --- | --- |
| giscus | 一等 | 官方 `@giscus/vue` 3.1.1、GitHub Discussions | 无主题 API | 需配置仓库；本地 mock 不验证生产服务 |
| Waline | 一等 | 固定 3.15.2 | 支持 | 需配置可访问的服务端 |
| Twikoo | 一等 | 固定 2.0.8 | 支持 | 需配置可访问的服务 |
| Valine | 旧版运行时 | 固定 1.5.3 | 无主题 API | App ID/key 为公开值，不能使用管理凭证 |

```yaml
comments:
  provider: waline # 也可选 twikoo、valine、giscus、none
  waline:
    server_url: https://comments.example.com
    language: auto
  twikoo:
    env_id: https://comments.example.com
    language: auto
  valine:
    app_id: ''
    app_key: ''
    language: auto
```

Sidebar 仅对 Waline 和 Twikoo 显示实时最新评论；giscus 显示正常的空状态。Demo 仍使用确定性的本地 fixture。浏览器 mock 只验证集成边界，不会向 GitHub 发帖；生产服务与历史记录连续性需要站点自行核查。

## 搜索、媒体与工具

- **Pagefind** 在 `astro build` 后索引 HTML，不使用 Algolia 凭据。
- **Lightbox** 增强普通文章 HTML；禁用 JS 时内容仍可读。
- **Code copy** 为生成的代码块添加增强交互。
- **Dia** 由 `dia.enabled`、`dia.locale` 和可选 `dia.tips` 配置；Demo 内容保持确定性。

## Footer 与 feeds

`footer.statistics.page_views` 和 `unique_visitors` 是手动展示字符串，不是实时统计。`site.started_date` 用于计算运行天数；`footer.beian` 可选。

根部署会生成 `/rss.xml`、`/cn/rss.xml`、`/sitemap.xml` 和 `/robots.txt`，并统一使用 `site.url` 与 `site.base`；构建环境中的 `ASTRO_SITE`/`ASTRO_BASE` 可覆盖它们。GitHub Pages Demo 的路径是 `/astro-theme-aurora/demo/rss.xml`、`/astro-theme-aurora/demo/cn/rss.xml`、`/astro-theme-aurora/demo/sitemap.xml` 和 `/astro-theme-aurora/demo/robots.txt`。两份 RSS 各自只含对应语言。普通构建排除 Demo 内容；公开条目可用 frontmatter `rss: false` 和 `sitemap: false` 分别退出对应索引。

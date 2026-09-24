# giscus：GitHub Discussions

[giscus](https://giscus.app/) 把页面映射到 GitHub Discussion。使用启用 Discussions 的**公开** GitHub 仓库，为其安装 [giscus App](https://github.com/apps/giscus)，并选择允许创建 Discussion 的分类。[配置器](https://giscus.app/)提供公开的仓库/分类 ID；Aurora 不需要 GitHub PAT 或 OAuth 客户端密钥。访客通过 GitHub/giscus 认证，管理在 Discussions 中完成。

1. 在配置器中完成仓库、App 和分类设置。
2. 将 `repo`、`repo_id`、`category`、`category_id` 复制到 `_config.yml` 并选择映射。`repo` 和 `repo_id` 必填；除 `number` 映射外，创建 Discussion 还需要 `category_id`。
3. 构建并打开两篇不同文章。以访客身份登录、发表评论，确认建立了预期的 Discussions；中文路由也要单独检查。

```yaml
comments:
  provider: giscus
  giscus:
    repo: example/blog-comments
    repo_id: R_example
    category: General
    category_id: DIC_example
    mapping: pathname
    strict: false
    reactions_enabled: true
    input_position: bottom
    theme: auto
    lang: auto
    loading: eager
```

用配置器给出的真实 ID 替换示例。其他受支持设置包括 `term`、`emit_metadata`，以及[基础配置](/cn/configs/general)列出的选项。`theme: auto` 跟随 Aurora 的最终明暗主题；`lang: auto` 跟随路由。Aurora 在评论区域进入视口时加载它。

## 有意选择映射

| 映射 | Discussion 键 |
| --- | --- |
| `pathname`（默认） | 浏览器路径，包含部署 base 和语言路径。 |
| `url` | 完整页面 URL；换域名会影响键。 |
| `title`、`og:title` | 页面标题或 OpenGraph 标题；改标题可能影响匹配。 |
| `specific` | `term`；`term: "{legacyUid}"` 可使用每页稳定 Aurora ID。 |
| `number` | `term` 中的正整数 Discussion 编号；所有页面使用同一个全局编号会共享 Discussion。 |

使用 `pathname` 时，`/post/example/` 和 `/my-blog/post/example/` 可能映射到不同 Discussions。`{legacyUid}` 仅在 `specific` 映射时展开；它**不会**自动匹配 Gitalk Issues 或转换后的 Discussions。字面量 `specific` term 会让多页共享 Discussion。改变域名、base、permalink 或映射策略前，检查真实 Discussion 标题并测试代表性旧文章。见 [Gitalk 迁移](/cn/comments/gitalk-migration)。

iframe 托管在 giscus/GitHub，独立于 Aurora 的 CSS 和 DOM。如果主机启用 Content Security Policy，应为当前 [giscus 集成](https://github.com/giscus/giscus)允许其 iframe 和网络请求所需源站；按自己的策略验证，不要直接复制通用指令清单。

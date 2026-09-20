# 国际化 / 多语言

Aurora 3.0 支持 English（`en`）和简体中文（`zh-CN`）两种构建时语言。URL 是唯一语言来源：默认英文不带前缀，中文使用 `/cn/`。

## 内容字段

`lang` 和 `translationKey` 都是可选 frontmatter 字段：

```yaml
lang: zh-CN
translationKey: welcome-aurora-3
```

没有 `lang` 的旧内容仍按英文处理。拥有相同 `translationKey` 的条目会被语言切换、SEO alternate 和当前语言搜索识别为翻译对，但不会替换 legacy UID、slug、permalink、标题哈希或评论身份。

## 路由与切换

英文保留 `/`、`/archives/`、`/post/example/` 等既有路径；中文在 `/cn/` 下提供对应页面，例如 `/cn/archives/` 和 `/cn/post/example/`。存在真实译文时切换器直接跳转到译文，否则回退到对应语言的栏目或首页，不生成不存在的文章链接。

不会根据浏览器语言、IP 或 `Accept-Language` 强制跳转。每种语言都在构建期生成静态 HTML，因此 hydration 前就已经确定语言。相同的组合逻辑适用于 `/`、`/aurora/`、`/blog/theme/` 和 Pages Demo 的 `/astro-theme-aurora/demo/`。

## SEO 与 Feed

每个页面都使用自己的 canonical，并生成 `lang="en"` 或 `lang="zh-CN"`。只有存在的翻译页才会生成 `en`、`zh-CN` 与 `x-default` alternate。OpenGraph 使用 `en_US` 与 `zh_CN`。Sitemap 同时包含两种语言；`/rss.xml` 是英文 Feed，`/cn/rss.xml` 是中文 Feed。

## 搜索与评论

Pagefind 分别生成 `en` 与 `zh-cn` 索引。搜索 island 显式接收当前语言，不合并另一套索引，因此结果链接会留在当前 base 和语言下。

翻译文章默认使用独立评论身份。英文文章保留 legacy identity；中文译文使用带语言作用域的 identity。生产 Gitalk、Valine、Twikoo 或 Waline 数据库的连续性，仍需要对照服务商的外部记录验证。

## 添加译文

1. 复制源文章并翻译可见内容。
2. 设置 `lang: en` 或 `lang: zh-CN`，并使用相同的 `translationKey`。
3. 独立设计译文的 slug、permalink 和标题；不要为了配对复制 identity 字段。
4. 发布前运行 `pnpm check`、`pnpm build` 和浏览器语言切换测试。

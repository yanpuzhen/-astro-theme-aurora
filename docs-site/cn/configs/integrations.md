# 集成

Aurora 的可选浏览器集成在构建时配置。要使用评论服务，请选择 [giscus、Waline、Twikoo 或 Valine](/cn/comments/)并按对应指南部署后端、完成验证。`comments.provider: none` 不加载评论服务商资源。Gitalk 已移除，见[迁移指南](/cn/comments/gitalk-migration)。[配置参考](/cn/configs/general)列出所有受支持字段与默认值。

- **Pagefind** 在 `pnpm build` 后索引生成的 HTML，不需要托管搜索账号。
- **灯箱**和**代码复制**增强生成的文章图片与代码块；没有 JavaScript 仍可阅读正文。
- **Dia** 通过 `dia.enabled`、`dia.locale`、可选 `dia.tips` 配置。
- **页脚统计**是手工输入的显示文字，不是实时分析；`site.started_date` 控制运行天数。
- **RSS、Sitemap、Robots** 自动生成；见 [SEO 与 Feed](/cn/reference/seo-feeds)。

公开客户端标识可以放在 `_config.yml` 或 `PUBLIC_*` 覆盖变量。服务商数据库凭据和管理密钥只属于相应后端，不能进入 Aurora 静态站点。

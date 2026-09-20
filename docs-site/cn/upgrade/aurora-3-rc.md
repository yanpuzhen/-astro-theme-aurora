# Aurora 3 RC

当前版本为 `3.0.0-rc.1`，适合迁移测试和反馈，不能直接视为无条件的生产兼容保证。

RC 已验证静态 HTML、route manifest、legacy title-hash identity、显式 permalink、Pagefind、中英文内容、nested base、响应式交互和无 JavaScript 可读性。由于没有生产评论数据库，未验证真实评论 provider 的连续性。

发布前请复核：

- 代表性迁移文章的 URL 与评论连续性；
- README 的描述是否仍与源码一致；
- migration guide 中列出的不支持旧功能；
- GitHub Pages 设置和最终 artifact；
- upstream attribution 与 license 义务；
- `docs/review/` 中的交接记录。

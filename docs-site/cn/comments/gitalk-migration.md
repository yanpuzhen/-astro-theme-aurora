# 从 Gitalk 迁移

Aurora 3 **没有 Gitalk 运行时**。上游 Gitalk 的浏览器端 OAuth 客户端密钥模式不会由 Aurora 暴露。旧 Gitalk 设置只作为迁移输入。Gitalk 将评论存为 GitHub Issues，giscus 使用 GitHub Discussions。仅修改 `comments.provider` 或转换 Issues，都不能保证旧页面找到转换后的 Discussion。

1. 备份旧站和 GitHub Issues。改路径前整理代表性文章 URL、标题、旧 UID 和 Issue 标题。
2. 在目标公开仓库启用 Discussions 并安装 [giscus App](https://github.com/apps/giscus)。按 [giscus 设置](/cn/comments/giscus)获取公开 ID。
3. 使用 GitHub 支持的转换操作先将部分 Issues 转为 Discussions。结果验证前保留原记录。
4. 选择 giscus 映射。`pathname` 随部署 base 和语言变化；`specific` 配合 `term: "{legacyUid}"` 展开每页 Aurora ID。转换后的 Discussion 标题必须实际匹配所选映射。字面量 term 或全局 `number` 可能让全部页面共享一条 Discussion。
5. 部署到测试地址，检查多篇旧英文/中文文章。对照真实 GitHub 记录核对展示的 Discussion、评论数和作者，再切换生产流量。

Aurora 的路由清单可以帮助比较规范路径、别名和 ID；没有外部记录时，它不能导入 Issues 或证明连续性。更全面的迁移见[从 Aurora 2 迁移](/cn/upgrade/from-aurora-2)。

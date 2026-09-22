# 集成

Aurora 将交互或外部服务隔离在静态内容层之外。

## 搜索、媒体与工具

- **Pagefind** 在 `astro build` 后索引生成的 HTML，不使用 Algolia 凭据。
- **Lightbox** 在 island 加载后增强文章图片；禁用 JavaScript 时图片仍是普通 HTML。
- **Code copy** 为生成的代码块添加复制按钮。
- **Dia** 通过 `PUBLIC_AURORA_DIA=true` 可选启用，Demo 不依赖外部后端。它保留原始的光球/主体/眼睛/平台结构，支持本地化提示、`data-dia` 上下文钩子、键盘焦点、移动端隐藏和 reduced-motion。
- **RSS**、**sitemap** 和 **robots** 生成静态文件。

## 评论

将 `PUBLIC_COMMENT_PROVIDER` 设置为 `none`、`gitalk`、`valine`、`twikoo` 或 `waline`。未配置 provider 时主题会隐藏评论区域。Demo 侧栏的最新评论是确定性的本地 fixture，不会写入任何 provider 数据库。

## Footer 与站点统计

设置 `PUBLIC_AURORA_STARTED_DATE`（格式 `YYYY-MM-DD`）即可显示真实运行天数。`PUBLIC_AURORA_PAGE_VIEWS` 和 `PUBLIC_AURORA_UNIQUE_VISITORS` 只接受已有统计集成提供的公开构建值；留空即可隐藏对应行。`PUBLIC_AURORA_AVATAR` 配置 Footer 头像。可选的 `PUBLIC_AURORA_BEIAN_*` 变量只在提供后渲染备案链接。Demo 使用明确标注的 fixture 值和固定 Showcase 开始日期。

| Provider | 构建变量 | Identity |
| --- | --- | --- |
| Gitalk | `PUBLIC_GITALK_CLIENT_ID`、`PUBLIC_GITALK_OWNER`、`PUBLIC_GITALK_REPO` | 默认使用 legacy UID，也支持 pathname 模式。 |
| Valine | `PUBLIC_VALINE_APP_ID`、`PUBLIC_VALINE_APP_KEY` | 保留不带结尾斜杠的历史 pathname。 |
| Twikoo | `PUBLIC_TWIKOO_ENV_ID` | 保留带结尾斜杠的历史 pathname。 |
| Waline | `PUBLIC_WALINE_SERVER_URL` | 保留带结尾斜杠的历史 pathname。 |

当前没有生产 provider records 可供验证。切换流量前请对代表性旧文章比较评论 key。静态构建中没有 `PUBLIC_GITALK_CLIENT_SECRET`；OAuth secret 必须放在受信服务中。

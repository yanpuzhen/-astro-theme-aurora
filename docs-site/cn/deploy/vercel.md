# 部署到 Vercel

Aurora 的普通产物是静态文件。Vercel 可通过 Git 导入部署 `dist/`；此站点不需要 `@astrojs/vercel` adapter。

1. 将配置好的 Aurora 仓库推送到 Git 平台并[导入 Vercel](https://vercel.com/docs/frameworks/frontend/astro)。
2. 选择仓库和生产分支。Vercel 可识别 Astro，但仍应核查项目设置，不要只依赖自动检测。
3. 使用 Node.js 22.13+ 与 pnpm 11.19+。需要明确填写时，安装命令为 `pnpm install --frozen-lockfile`，构建为 `pnpm build`，输出目录为 `dist`。
4. 将 `ASTRO_SITE` 设为最终生产源站，例如 `https://blog.example.com`，`ASTRO_BASE` 设为 `/`。在生产环境设置它们；评论服务的密钥留在各自服务端。
5. 部署后检查生产 URL、文章、搜索、两种语言及 [SEO/Feed](/cn/reference/seo-feeds)。

非生产修改会产生 Vercel 预览部署。预览域名与配置的生产规范源站不同；共用构建配置时这是预期结果。把预览站当作可索引站分享前，应核对规范链接。自定义域名在 Vercel 项目域名设置中添加，完成 DNS 验证后把 `ASTRO_SITE` 改为该源站并重新部署。根域名通常仍使用 `ASTRO_BASE=/`；见[域名与 Base 路径](/cn/deploy/domains-and-base)。

构建失败时检查 Vercel 构建日志、Node/pnpm 版本及 `_config.yml` 校验错误。资源 404 时检查 `ASTRO_BASE` 和生成的 URL。平台细节以 Vercel [Astro 指南](https://vercel.com/docs/frameworks/frontend/astro)与 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/vercel/)为准。

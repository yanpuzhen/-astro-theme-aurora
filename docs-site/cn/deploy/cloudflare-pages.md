# 部署到 Cloudflare Pages

本指南使用 **Cloudflare Pages Git 集成**与 Aurora 的静态 `dist/` 产物。普通 Aurora 博客不需要 Astro Cloudflare SSR adapter。Cloudflare 当前的 [Pages 概览](https://developers.cloudflare.com/pages/)建议新应用项目使用 Workers；Pages 仍有官方文档，也支持这个静态部署。

1. 将配置好的 Aurora 仓库推送到 GitHub 或 GitLab。在 Cloudflare 创建连接该仓库的 **Pages** 项目，选择实际发布的生产分支。
2. 构建设置使用 `pnpm build`，输出目录为 `dist`（Cloudflare Astro 指南给出等效的 `npm run build`/`dist`）。项目根目录为仓库根目录。
3. 确保构建环境提供 Node.js 22.13+ 与 pnpm 11.19+；如果自动默认值不同，按当前 [Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)设置版本。保留锁文件；显式配置安装步骤时使用 frozen install。
4. 将生产环境 `ASTRO_SITE` 设为最终规范源站；根路径 Pages/自定义域名站点将 `ASTRO_BASE` 设为 `/`。部署并检查生成站点。
5. 在 Pages 域名设置中按 Cloudflare 步骤添加并验证自定义域名；修改 `ASTRO_SITE` 后重新部署。预览分支部署可能有不同域名，索引前检查规范 URL。

`dist/` 就是用户博客的完整产物。仓库的 Docs/Demo 合并 Pages 工作流是另一个用途。CSS/图片丢失或 RSS 链接错误时，对照[域名与 Base 路径](/cn/deploy/domains-and-base)检查实际 URL。当前控制台细节见 Cloudflare 官方 [Astro on Pages 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)与[自定义域名指南](https://developers.cloudflare.com/pages/configuration/custom-domains/)。

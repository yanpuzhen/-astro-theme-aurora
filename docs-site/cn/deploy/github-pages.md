# 将博客部署到 GitHub Pages

本指南针对**你自己的 Aurora 博客**。Aurora 项目仓库另有维护者专用的 Docs + Demo 产物，由 `pnpm pages:build` 组合；普通博客不要使用该命令。博客执行 `pnpm build`，发布 `dist/`。

## 确定地址

项目仓库 `username/my-blog` 对应 `https://username.github.io/my-blog/` 时，设置 `ASTRO_SITE=https://username.github.io`、`ASTRO_BASE=/my-blog/`。名为 `username.github.io` 的用户/组织根站使用 `ASTRO_BASE=/`。必须与 GitHub 实际提供的地址一致；见[域名与 Base 路径](/cn/deploy/domains-and-base)。

## 配置 GitHub Actions

在仓库 **Settings → Pages** 选择 **GitHub Actions** 作为构建/部署来源。在仓库中添加 `.github/workflows/deploy.yml`，并按项目替换示例源站、base 和分支。下列 Action 主版本已于 2026-09-24 对照 GitHub 官方 Action Release 核查；更新工作流时请重新查看其 Release。

```yaml
name: Deploy Aurora blog
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 11.19.0
      - uses: actions/setup-node@v7
        with:
          node-version: '22'
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          ASTRO_SITE: https://username.github.io
          ASTRO_BASE: /my-blog/
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

工作流需要 `pages: write`、`id-token: write` 以发布，以及 `contents: read` 以检出代码。GitHub 可为 `github-pages` 环境设置保护规则。推送后查看 Actions 运行和 Pages 部署，再检查文章、嵌套资源、搜索、`/my-blog/rss.xml`、`/my-blog/cn/rss.xml`、`/my-blog/sitemap.xml`、`/my-blog/robots.txt`。

如果自定义域名从根路径提供站点，按 [GitHub 域名指南](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)配置和验证，设置 `ASTRO_SITE` 为该自定义源站、`ASTRO_BASE=/`，然后重新构建。当前平台要求见 GitHub 的[自定义工作流指南](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)和 [Astro GitHub Pages 指南](https://docs.astro.build/en/guides/deploy/github/)。

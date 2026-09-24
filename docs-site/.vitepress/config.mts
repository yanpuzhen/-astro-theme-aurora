import { defineConfig } from 'vitepress'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const repository = 'https://github.com/yanpuzhen/astro-theme-aurora'
const demo = 'https://yanpuzhen.github.io/astro-theme-aurora/demo/'
const base = '/astro-theme-aurora/'

const enSidebar = [
  { text: 'Guide', items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Configuration Guide', link: '/guide/configuration' },
    { text: 'Writing Posts & Pages', link: '/guide/writing-content' },
    { text: 'Internationalization', link: '/guide/internationalization' },
  ] },
  { text: 'Deployment', items: [
    { text: 'Overview', link: '/deploy/' },
    { text: 'Vercel', link: '/deploy/vercel' },
    { text: 'Cloudflare Pages', link: '/deploy/cloudflare-pages' },
    { text: 'GitHub Pages', link: '/deploy/github-pages' },
    { text: 'Domains & Base Paths', link: '/deploy/domains-and-base' },
  ] },
  { text: 'Comments', items: [
    { text: 'Choose a System', link: '/comments/' },
    { text: 'giscus', link: '/comments/giscus' },
    { text: 'Waline', link: '/comments/waline' },
    { text: 'Twikoo', link: '/comments/twikoo' },
    { text: 'Valine', link: '/comments/valine' },
    { text: 'Gitalk Migration', link: '/comments/gitalk-migration' },
  ] },
  { text: 'Configuration Reference', items: [
    { text: 'General', link: '/configs/general' },
    { text: 'Menu', link: '/configs/menu' },
    { text: 'Theme', link: '/configs/theme' },
    { text: 'Routing', link: '/configs/routing' },
    { text: 'Post', link: '/configs/post' },
    { text: 'Page & Navigation', link: '/configs/page' },
    { text: 'Social Links', link: '/configs/social' },
    { text: 'Integrations', link: '/configs/integrations' },
    { text: 'Site Meta', link: '/configs/site-meta' },
    { text: 'Markdown', link: '/configs/markdown' },
  ] },
  { text: 'Reference', items: [
    { text: 'Frontmatter', link: '/reference/frontmatter' },
    { text: 'Environment Variables', link: '/reference/environment' },
    { text: 'SEO, RSS, Sitemap & Robots', link: '/reference/seo-feeds' },
    { text: 'Troubleshooting', link: '/reference/troubleshooting' },
  ] },
  { text: 'Upgrade', items: [
    { text: 'From Aurora 2.x', link: '/upgrade/from-aurora-2' },
    { text: 'Aurora 3 RC', link: '/upgrade/aurora-3-rc' },
  ] },
]

const cnSidebar = [
  { text: '使用指南', items: [
    { text: '开始使用', link: '/cn/guide/getting-started' },
    { text: '配置指南', link: '/cn/guide/configuration' },
    { text: '撰写文章与页面', link: '/cn/guide/writing-content' },
    { text: '国际化 / 多语言', link: '/cn/guide/internationalization' },
  ] },
  { text: '部署', items: [
    { text: '概览', link: '/cn/deploy/' },
    { text: 'Vercel', link: '/cn/deploy/vercel' },
    { text: 'Cloudflare Pages', link: '/cn/deploy/cloudflare-pages' },
    { text: 'GitHub Pages', link: '/cn/deploy/github-pages' },
    { text: '域名与 Base 路径', link: '/cn/deploy/domains-and-base' },
  ] },
  { text: '评论', items: [
    { text: '选择评论系统', link: '/cn/comments/' },
    { text: 'giscus', link: '/cn/comments/giscus' },
    { text: 'Waline', link: '/cn/comments/waline' },
    { text: 'Twikoo', link: '/cn/comments/twikoo' },
    { text: 'Valine', link: '/cn/comments/valine' },
    { text: 'Gitalk 迁移', link: '/cn/comments/gitalk-migration' },
  ] },
  { text: '配置参考', items: [
    { text: '基础配置', link: '/cn/configs/general' },
    { text: '菜单', link: '/cn/configs/menu' },
    { text: '主题', link: '/cn/configs/theme' },
    { text: '路由', link: '/cn/configs/routing' },
    { text: '文章', link: '/cn/configs/post' },
    { text: '页面 & 导航', link: '/cn/configs/page' },
    { text: '社交链接', link: '/cn/configs/social' },
    { text: '集成', link: '/cn/configs/integrations' },
    { text: '网页 Meta', link: '/cn/configs/site-meta' },
    { text: 'Markdown', link: '/cn/configs/markdown' },
  ] },
  { text: '参考', items: [
    { text: 'Frontmatter', link: '/cn/reference/frontmatter' },
    { text: '环境变量', link: '/cn/reference/environment' },
    { text: 'SEO、RSS、Sitemap 与 Robots', link: '/cn/reference/seo-feeds' },
    { text: '故障排查', link: '/cn/reference/troubleshooting' },
  ] },
  { text: '升级', items: [
    { text: '从 Aurora 2.x 迁移', link: '/cn/upgrade/from-aurora-2' },
    { text: 'Aurora 3 RC', link: '/cn/upgrade/aurora-3-rc' },
  ] },
]

const enNav = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'Deployment', link: '/deploy/' },
  { text: 'Comments', link: '/comments/' },
  { text: 'Reference', items: [
    { text: 'Configuration', link: '/configs/general' },
    { text: 'Frontmatter', link: '/reference/frontmatter' },
    { text: 'Environment', link: '/reference/environment' },
    { text: 'SEO & Feeds', link: '/reference/seo-feeds' },
    { text: 'Troubleshooting', link: '/reference/troubleshooting' },
    { text: 'Upgrade', link: '/upgrade/from-aurora-2' },
  ] },
  { text: 'Live Demo', link: demo },
  { text: 'GitHub', link: repository },
]

const cnNav = [
  { text: '指南', link: '/cn/guide/getting-started' },
  { text: '部署', link: '/cn/deploy/' },
  { text: '评论', link: '/cn/comments/' },
  { text: '参考', items: [
    { text: '配置', link: '/cn/configs/general' },
    { text: 'Frontmatter', link: '/cn/reference/frontmatter' },
    { text: '环境变量', link: '/cn/reference/environment' },
    { text: 'SEO 与 Feed', link: '/cn/reference/seo-feeds' },
    { text: '故障排查', link: '/cn/reference/troubleshooting' },
    { text: '升级', link: '/cn/upgrade/from-aurora-2' },
  ] },
  { text: '在线预览', link: demo },
  { text: 'GitHub', link: repository },
]

const enLocaleThemeConfig = {
  nav: enNav,
  sidebar: { '/': enSidebar },
  outline: { label: 'On this page' },
  lastUpdatedText: 'Last updated',
  editLink: { pattern: `${repository}/edit/dev/docs-site/:path`, text: 'Edit this page on GitHub' },
  docFooter: { prev: 'Previous page', next: 'Next page' },
  langMenuLabel: 'Change language',
  search: { provider: 'local' },
}

const cnLocaleThemeConfig = {
  nav: cnNav,
  sidebar: { '/cn/': cnSidebar },
  outline: { label: '本页目录' },
  lastUpdatedText: '最后更新',
  editLink: { pattern: `${repository}/edit/dev/docs-site/:path`, text: '在 GitHub 上编辑此页' },
  docFooter: { prev: '上一页', next: '下一页' },
  langMenuLabel: '切换语言',
  search: {
    provider: 'local',
    options: {
      locales: {
        cn: { translations: { button: { buttonText: '搜索', buttonAriaLabel: '搜索' } } },
      },
    },
  },
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换到浅色主题',
  darkModeSwitchTitle: '切换到深色主题',
  sidebarMenuLabel: '目录',
  returnToTopLabel: '返回顶部',
  skipToContentLabel: '跳转到正文',
}

function writeCompatibilityRedirect(file: string, destination: string) {
  mkdirSync(dirname(file), { recursive: true })
  const target = `${base}${destination.replace(/^\//, '')}`
  writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${target}"><title>Aurora 3.0 documentation moved</title></head><body><p>This English Aurora 3.0 documentation URL moved to <a href="${target}">${target}</a>.</p></body></html>`, 'utf8')
}

export default defineConfig({
  title: 'Aurora 3.0',
  description: 'Documentation for the Aurora 3.0 Astro theme.',
  base,
  // English source files remain under /en for source compatibility, but their
  // canonical output is rooted at / so existing English URLs are not replaced.
  rewrites: { 'en/:path*': ':path*' },
  srcExclude: ['en/index.md'],
  lang: 'en',
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: `${base}favicon.svg` }]],
  locales: {
    root: { label: 'English', lang: 'en', link: '/', themeConfig: enLocaleThemeConfig },
    cn: { label: '中文', lang: 'zh-CN', link: '/cn/', themeConfig: cnLocaleThemeConfig },
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: enNav,
    sidebar: {
      '/': enSidebar,
      '/en/': enSidebar,
    },
    socialLinks: [{ icon: 'github', link: repository }],
    editLink: {
      pattern: `${repository}/edit/dev/docs-site/:path`,
      text: 'Edit this page on GitHub',
    },
    search: { provider: 'local' },
    footer: {
      message: 'Aurora 3.0 is released under the GPL-2.0-only license.',
      copyright: 'Aurora 3.0 · Original Aurora by TriDiamond / Benny Guo',
    },
  },
  buildEnd(siteConfig) {
    // VitePress's locale switcher can now compute /cn/<same-page> because the
    // canonical English page data is rewritten to the root. Keep the old /en
    // tree as explicit noindex redirects for bookmarks and published links.
    for (const source of siteConfig.pages.filter((page) => page.startsWith('en/'))) {
      const canonical = siteConfig.rewrites.map[source] || source
      const relative = canonical.replace(/\.md$/, '').replace(/\/index$/, '')
      const legacy = source.replace(/\.md$/, '').replace(/\/index$/, '')
      const destination = `/${relative}`
      const htmlFile = resolve(siteConfig.outDir, `${legacy}.html`)
      writeCompatibilityRedirect(htmlFile, destination)
      if (legacy !== 'en') writeCompatibilityRedirect(resolve(siteConfig.outDir, legacy, 'index.html'), destination)
    }
    writeCompatibilityRedirect(resolve(siteConfig.outDir, 'en', 'index.html'), '/')
  },
})

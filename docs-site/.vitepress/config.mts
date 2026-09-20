import { defineConfig } from 'vitepress'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const repository = 'https://github.com/yanpuzhen/astro-theme-aurora'
const demo = 'https://yanpuzhen.github.io/astro-theme-aurora/demo/'
const base = '/astro-theme-aurora/'

const enSidebar = [
  {
    text: 'Guide',
    items: [{ text: 'Getting Started', link: '/guide/getting-started' }, { text: 'Internationalization', link: '/guide/internationalization' }],
  },
  {
    text: 'Configuration',
    items: [
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
    ],
  },
  {
    text: 'Upgrade',
    items: [
      { text: 'From Aurora 2.x', link: '/upgrade/from-aurora-2' },
      { text: 'Aurora 3 RC', link: '/upgrade/aurora-3-rc' },
    ],
  },
]

const cnSidebar = [
  {
    text: '使用指南',
    items: [{ text: '开始使用', link: '/cn/guide/getting-started' }, { text: '国际化 / 多语言', link: '/cn/guide/internationalization' }],
  },
  {
    text: '主题配置',
    items: [
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
    ],
  },
  {
    text: '升级',
    items: [
      { text: '从 Aurora 2.x 迁移', link: '/cn/upgrade/from-aurora-2' },
      { text: 'Aurora 3 RC', link: '/cn/upgrade/aurora-3-rc' },
    ],
  },
]

const enNav = [
  { text: 'Guide', items: [{ text: 'Getting Started', link: '/guide/getting-started' }, { text: 'Internationalization', link: '/guide/internationalization' }] },
  { text: 'Configuration', link: '/configs/general' },
  { text: 'Upgrade', link: '/upgrade/from-aurora-2' },
  { text: 'Live Demo', link: demo },
  { text: 'GitHub', link: repository },
]

const cnNav = [
  { text: '指南', items: [{ text: '开始使用', link: '/cn/guide/getting-started' }, { text: '国际化 / 多语言', link: '/cn/guide/internationalization' }] },
  { text: '配置', link: '/cn/configs/general' },
  { text: '升级', link: '/cn/upgrade/from-aurora-2' },
  { text: '在线预览', link: demo },
  { text: 'GitHub', link: repository },
]

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
    root: { label: 'English', lang: 'en', link: '/' },
    cn: { label: '中文', lang: 'zh-CN', link: '/cn/' },
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: enNav,
    sidebar: {
      '/': enSidebar,
      '/en/': enSidebar,
      '/cn/': cnSidebar,
    },
    locales: {
      root: {
        nav: enNav,
        sidebar: { '/': enSidebar },
        outline: { label: 'On this page' },
        lastUpdatedText: 'Last updated',
        editLink: { pattern: `${repository}/edit/dev/docs-site/:path`, text: 'Edit this page on GitHub' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        langMenuLabel: 'Change language', search: { provider: 'local' },
      },
      cn: {
        nav: cnNav,
        sidebar: { '/cn/': cnSidebar },
        outline: { label: '本页目录' },
        lastUpdatedText: '最后更新',
        editLink: { pattern: `${repository}/edit/dev/docs-site/:path`, text: '在 GitHub 上编辑此页' },
        docFooter: { prev: '上一页', next: '下一页' },
        langMenuLabel: '切换语言', search: { provider: 'local' },
        darkModeSwitchLabel: '外观', lightModeSwitchTitle: '切换到浅色主题', darkModeSwitchTitle: '切换到深色主题',
        sidebarMenuLabel: '目录', returnToTopLabel: '返回顶部', skipToContentLabel: '跳转到正文',
      },
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

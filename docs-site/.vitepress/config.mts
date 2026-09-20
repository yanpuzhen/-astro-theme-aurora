import { defineConfig } from 'vitepress'

const repository = 'https://github.com/yanpuzhen/astro-theme-aurora'
const demo = 'https://yanpuzhen.github.io/astro-theme-aurora/demo/'
const base = '/astro-theme-aurora/'

const enSidebar = [
  {
    text: 'Guide',
    items: [{ text: 'Getting Started', link: '/en/guide/getting-started' }],
  },
  {
    text: 'Configuration',
    items: [
      { text: 'General', link: '/en/configs/general' },
      { text: 'Menu', link: '/en/configs/menu' },
      { text: 'Theme', link: '/en/configs/theme' },
      { text: 'Routing', link: '/en/configs/routing' },
      { text: 'Post', link: '/en/configs/post' },
      { text: 'Page & Navigation', link: '/en/configs/page' },
      { text: 'Social Links', link: '/en/configs/social' },
      { text: 'Integrations', link: '/en/configs/integrations' },
      { text: 'Site Meta', link: '/en/configs/site-meta' },
      { text: 'Markdown', link: '/en/configs/markdown' },
    ],
  },
  {
    text: 'Upgrade',
    items: [
      { text: 'From Aurora 2.x', link: '/en/upgrade/from-aurora-2' },
      { text: 'Aurora 3 RC', link: '/en/upgrade/aurora-3-rc' },
    ],
  },
]

const cnSidebar = [
  {
    text: '使用指南',
    items: [{ text: '开始使用', link: '/cn/guide/getting-started' }],
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

export default defineConfig({
  title: 'Aurora 3.0',
  description: 'Documentation for the Aurora 3.0 Astro theme.',
  base,
  lang: 'en',
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: `${base}favicon.svg` }]],
  locales: {
    root: { label: 'English', lang: 'en', link: '/' },
    cn: { label: '中文', lang: 'zh-CN', link: '/cn/' },
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      {
        text: 'Guide 指南',
        items: [
          { text: '🇬🇧 Guide', link: '/en/guide/getting-started' },
          { text: '🇨🇳 指南', link: '/cn/guide/getting-started' },
        ],
      },
      {
        text: 'Config 配置',
        items: [
          { text: '🇬🇧 Configuration', link: '/en/configs/general' },
          { text: '🇨🇳 配置', link: '/cn/configs/general' },
        ],
      },
      {
        text: 'Upgrade 升级',
        items: [
          { text: '🇬🇧 Upgrade', link: '/en/upgrade/from-aurora-2' },
          { text: '🇨🇳 升级', link: '/cn/upgrade/from-aurora-2' },
        ],
      },
      { text: 'Live Demo 在线预览', link: demo },
      { text: 'GitHub', link: repository },
    ],
    sidebar: {
      '/en/': enSidebar,
      '/cn/': cnSidebar,
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
})

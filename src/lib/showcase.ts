import { localizedSitePath } from './routing'
import type { AuroraLocale } from './i18n'

export const isDemoBuild = () => process.env.ASTRO_DEMO_BUILD === 'true'

export interface DemoProfile {
  name: string
  avatar: string
  description: string
  socials: { label: string; href: string }[]
}

export interface DemoComment {
  name: string
  text: string
  avatar: string
  postSlug: string
  date: string
}

export interface DemoLink {
  name: string
  url: string
  avatar: string
  description: string
  category: 'Projects' | 'Resources' | '项目' | '资源'
  color: string
}

export const demoProfile: Record<AuroraLocale, DemoProfile> = {
  en: {
    name: 'Aurora Demo',
    avatar: 'https://picsum.photos/seed/aurora-demo-avatar/256/256',
    description: 'A deterministic showcase for Aurora 3: static publishing, focused islands, and expressive content.',
    socials: [
      { label: 'GitHub', href: 'https://github.com/yanpuzhen/astro-theme-aurora' },
      { label: 'Docs', href: 'https://yanpuzhen.github.io/astro-theme-aurora/' },
      { label: 'Issues', href: 'https://github.com/yanpuzhen/astro-theme-aurora/issues' },
    ],
  },
  'zh-CN': {
    name: 'Aurora Demo',
    avatar: 'https://picsum.photos/seed/aurora-demo-avatar/256/256',
    description: '用于展示 Aurora 3 的确定性样例：静态发布、轻量交互岛和丰富内容能力。',
    socials: [
      { label: 'GitHub', href: 'https://github.com/yanpuzhen/astro-theme-aurora' },
      { label: 'Docs', href: 'https://yanpuzhen.github.io/astro-theme-aurora/cn/' },
      { label: 'Issues', href: 'https://github.com/yanpuzhen/astro-theme-aurora/issues' },
    ],
  },
}

export const demoComments: Record<AuroraLocale, DemoComment[]> = {
  en: [
    { name: 'Mira Chen', text: 'The static HTML and the lightbox feel wonderfully calm together.', avatar: 'https://picsum.photos/seed/aurora-comment-mira/96/96', postSlug: 'demo-media', date: '2026-09-20' },
    { name: 'Theo Park', text: 'I came for the code examples and stayed for the little details in the archive and search.', avatar: 'https://picsum.photos/seed/aurora-comment-theo/96/96', postSlug: 'demo-code-showcase', date: '2026-09-18' },
    { name: 'Lin Rivera', text: 'The matrix example is a great quick check that the build-time math renderer is active.', avatar: 'https://picsum.photos/seed/aurora-comment-lin/96/96', postSlug: 'demo-math', date: '2026-09-17' },
  ],
  'zh-CN': [
    { name: '林晓', text: '中文内容、公式和代码在静态页面里都很清晰，移动端阅读也很顺畅。', avatar: 'https://picsum.photos/seed/aurora-comment-xiao/96/96', postSlug: 'demo-math-cn', date: '2026-09-19' },
    { name: '周远', text: '友链页把项目和资源分得很清楚，正好可以顺手看看 Aurora 的文档。', avatar: 'https://picsum.photos/seed/aurora-comment-yuan/96/96', postSlug: 'demo-rich-markdown-cn', date: '2026-09-16' },
  ],
}

export const demoLinks: Record<AuroraLocale, DemoLink[]> = {
  en: [
    { name: 'Aurora 3', url: 'https://github.com/yanpuzhen/astro-theme-aurora', avatar: 'https://picsum.photos/seed/aurora-link-project/128/128', description: 'The Astro migration and showcase repository.', category: 'Projects', color: '#24c6dc' },
    { name: 'Original Aurora', url: 'https://github.com/auroral-ui/hexo-theme-aurora', avatar: 'https://picsum.photos/seed/aurora-link-original/128/128', description: 'The visual and feature reference for the migration.', category: 'Projects', color: '#ff0099' },
    { name: 'Astro', url: 'https://astro.build/', avatar: 'https://picsum.photos/seed/aurora-link-astro/128/128', description: 'The static-first web framework behind Aurora 3.', category: 'Resources', color: '#5433ff' },
    { name: 'Vue', url: 'https://vuejs.org/', avatar: 'https://picsum.photos/seed/aurora-link-vue/128/128', description: 'Focused islands power the interactive enhancements.', category: 'Resources', color: '#42b883' },
    { name: 'Vite', url: 'https://vite.dev/', avatar: 'https://picsum.photos/seed/aurora-link-vite/128/128', description: 'Fast development and build tooling.', category: 'Resources', color: '#646cff' },
    { name: 'Pagefind', url: 'https://pagefind.app/', avatar: 'https://picsum.photos/seed/aurora-link-pagefind/128/128', description: 'Static search for the generated archive.', category: 'Resources', color: '#f59e0b' },
    { name: 'KaTeX', url: 'https://katex.org/', avatar: 'https://picsum.photos/seed/aurora-link-katex/128/128', description: 'Build-time math rendering for rich documents.', category: 'Resources', color: '#0ea5e9' },
  ],
  'zh-CN': [
    { name: 'Aurora 3', url: 'https://github.com/yanpuzhen/astro-theme-aurora', avatar: 'https://picsum.photos/seed/aurora-link-project/128/128', description: 'Aurora Astro 迁移与 Showcase 仓库。', category: '项目', color: '#24c6dc' },
    { name: 'Original Aurora', url: 'https://github.com/auroral-ui/hexo-theme-aurora', avatar: 'https://picsum.photos/seed/aurora-link-original/128/128', description: '本次迁移参考的视觉与功能来源。', category: '项目', color: '#ff0099' },
    { name: 'Astro', url: 'https://astro.build/', avatar: 'https://picsum.photos/seed/aurora-link-astro/128/128', description: 'Aurora 3 使用的静态优先 Web 框架。', category: '资源', color: '#5433ff' },
    { name: 'Vue', url: 'https://vuejs.org/', avatar: 'https://picsum.photos/seed/aurora-link-vue/128/128', description: '为交互增强提供 focused islands。', category: '资源', color: '#42b883' },
    { name: 'Vite', url: 'https://vite.dev/', avatar: 'https://picsum.photos/seed/aurora-link-vite/128/128', description: '快速的开发与构建工具链。', category: '资源', color: '#646cff' },
    { name: 'Pagefind', url: 'https://pagefind.app/', avatar: 'https://picsum.photos/seed/aurora-link-pagefind/128/128', description: '为静态归档提供搜索能力。', category: '资源', color: '#f59e0b' },
    { name: 'KaTeX', url: 'https://katex.org/', avatar: 'https://picsum.photos/seed/aurora-link-katex/128/128', description: '为复杂文档提供构建期数学公式渲染。', category: '资源', color: '#0ea5e9' },
  ],
}

export const demoFooter = {
  pageViews: '12,480',
  uniqueVisitors: '4,096',
  startedDate: '2024-01-01',
}

export function commentHref(comment: DemoComment, locale: AuroraLocale): string {
  return `${localizedSitePath(`/post/${comment.postSlug}/`, locale)}#comments`
}

export function runningDays(startedDate: string, now = new Date()): number | undefined {
  const start = new Date(`${startedDate}T00:00:00Z`)
  if (!startedDate || Number.isNaN(start.valueOf())) return undefined
  return Math.max(0, Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.valueOf()) / 86400000))
}

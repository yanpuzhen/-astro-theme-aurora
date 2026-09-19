export type AuroraLocale = 'en' | 'zh-CN'

export interface AuroraMessages {
  home: string; latestArticles: string; viewArchive: string; all: string
  featured: string; pinned: string; tags: string; categories: string; archives: string
  about: string; search: string; comments: string; skipToContent: string
  builtWith: string; newer: string; older: string
}

const messages: Record<AuroraLocale, AuroraMessages> = {
  en: {
    home: 'Home', latestArticles: 'Latest articles', viewArchive: 'View archive →', all: 'All',
    featured: 'Featured', pinned: 'Pinned', tags: 'Tags', categories: 'Categories', archives: 'Archives',
    about: 'About', search: 'Search', comments: 'Comments', skipToContent: 'Skip to content',
    builtWith: 'Built with Aurora.', newer: '← Newer', older: 'Older →',
  },
  'zh-CN': {
    home: '首页', latestArticles: '最新文章', viewArchive: '查看归档 →', all: '全部', featured: '精选',
    pinned: '置顶', tags: '标签', categories: '分类', archives: '归档', about: '关于', search: '搜索',
    comments: '评论', skipToContent: '跳转到正文', builtWith: '由 Aurora 构建。', newer: '← 较新', older: '较旧 →',
  },
}

export function normalizeLocale(value: string | undefined): AuroraLocale {
  return value?.toLowerCase() === 'zh-cn' ? 'zh-CN' : 'en'
}

export function messagesFor(locale: AuroraLocale): AuroraMessages { return messages[locale] }

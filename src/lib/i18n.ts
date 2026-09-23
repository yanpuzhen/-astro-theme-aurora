export type AuroraLocale = 'en' | 'zh-CN'

export const supportedLocales = ['en', 'zh-CN'] as const satisfies readonly AuroraLocale[]
export const defaultLocale: AuroraLocale = 'en'
export const fallbackLocale: AuroraLocale = defaultLocale

export const localeLabels: Record<AuroraLocale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
}

export const localeSegments: Record<AuroraLocale, string> = {
  en: '',
  'zh-CN': 'cn',
}

export interface AuroraMessages {
  home: string; latestArticles: string; viewArchive: string; all: string
  featured: string; pinned: string; tags: string; categories: string; archives: string
  about: string; links: string; search: string; comments: string; skipToContent: string
  builtWith: string; newer: string; older: string; articles: string; article: string
  previous: string; next: string; previousArticle: string; nextArticle: string
  readMore: string; published: string; updated: string; author: string; theme: string
  language: string; menu: string; close: string; openSearch: string; searchPlaceholder: string
  searchStart: string; searching: string; searchUnavailable: string; noResults: string
  clearSearch: string; pagefindIndex: string; typeToSearch: string; copy: string; copied: string
  contents: string; timeline: string; taxonomy: string; tag: string; category: string
  defaultCategory: string; noRecentComments: string; noFriendLinks: string; linksDescription: string
  friends: string; connectCreators: string; noJsFallback: string; useLightTheme: string
  useDarkTheme: string; openMenu: string; closeMenu: string; switchTo: string
  docs: string; github: string; primaryNavigation: string
  closeImage: string; unavailable: string; brandDescription: string; rightsReserved: string; originalVisualSystem: string
  tableOfContents: string; minutes: string; words: string; notFoundTitle: string; notFoundMessage: string
  featuredArticles: string; editorSelection: string; recommended: string
  poweredBy: string; themedBy: string; pageViews: string; uniqueVisitors: string; siteRunningFor: string
  day: string; demoStats: string; projects: string; resources: string; linksIntro: string; aboutIntro: string
  homeAction: string; searchAction: string; noCommentsConfigured: string
  commentLoading: string; commentSetupMissing: string; commentLoadError: string; commentsRequireJavaScript: string
  recentCommentsLoadError: string; recentCommentsLoading: string
  filing: string; policeFiling: string
}

const messages: Record<AuroraLocale, AuroraMessages> = {
  en: {
    home: 'Home', latestArticles: 'Latest articles', viewArchive: 'View archive →', all: 'All',
    featured: 'Featured', pinned: 'Pinned', tags: 'Tags', categories: 'Categories', archives: 'Archives',
    about: 'About', links: 'Links', search: 'Search', comments: 'Comments', skipToContent: 'Skip to content',
    builtWith: 'Built with Aurora.', newer: '← Newer', older: 'Older →', articles: 'Articles', article: 'Article',
    previous: 'Previous', next: 'Next', previousArticle: 'Previous article', nextArticle: 'Next article',
    readMore: 'Read more', published: 'Published', updated: 'Updated', author: 'Author', theme: 'Theme',
    language: 'Language', menu: 'Menu', close: 'Close', openSearch: 'Open search', searchPlaceholder: 'Search Aurora...',
    searchStart: 'Search across the statically generated Aurora archive.', searching: 'Searching...',
    searchUnavailable: 'The search index is unavailable in this build.', noResults: 'No results.', clearSearch: 'Clear search',
    pagefindIndex: 'Pagefind index', typeToSearch: 'Type to search', copy: 'Copy', copied: 'Copied', contents: 'Contents',
    timeline: 'Timeline', taxonomy: 'Taxonomy', tag: 'Tag', category: 'Category', defaultCategory: 'Aurora',
    noRecentComments: 'No recent comments', noFriendLinks: 'No friend links configured',
    linksDescription: 'This static shell is ready for opt-in links without fabricating external records.',
    friends: 'Friends and links', connectCreators: 'Connect with Aurora creators', noJsFallback: 'Open the search page',
    useLightTheme: 'Use light theme', useDarkTheme: 'Use dark theme', openMenu: 'Open menu', closeMenu: 'Close menu',
    switchTo: 'Switch to', docs: 'Docs', github: 'GitHub', primaryNavigation: 'Primary navigation',
    closeImage: 'Close image', unavailable: 'Unavailable', brandDescription: 'Futuristic publishing with the original Aurora glow.',
    rightsReserved: 'All Rights Reserved.', originalVisualSystem: 'Original visual system by',
    tableOfContents: 'Contents', minutes: 'min.', words: 'words', notFoundTitle: 'Page not found',
    notFoundMessage: 'The page you requested does not exist.', featuredArticles: 'Featured articles',
    editorSelection: "EDITOR'S SELECTION", recommended: 'Recommended', poweredBy: 'Powered by', themedBy: 'Themed by',
    pageViews: 'Page views', uniqueVisitors: 'Unique visitors', siteRunningFor: 'Site running for', day: 'days',
    demoStats: 'Demo showcase data', projects: 'Projects', resources: 'Resources', linksIntro: 'Curated project and resource links for this showcase.',
    aboutIntro: 'Aurora 3 provides static HTML, multilingual content, focused islands, and a build-time Markdown pipeline.',
    homeAction: 'Back to home', searchAction: 'Search the archive', noCommentsConfigured: 'Comments are not configured for this site.',
    commentLoading: 'Loading comments…', commentSetupMissing: 'The selected comment provider is not fully configured.',
    commentLoadError: 'Comments could not be loaded. The article is still available.', commentsRequireJavaScript: 'Comments require JavaScript; the article remains available.',
    recentCommentsLoadError: 'Recent comments are temporarily unavailable.', recentCommentsLoading: 'Loading recent comments…',
    filing: 'Filing', policeFiling: 'Police filing',
  },
  'zh-CN': {
    home: '首页', latestArticles: '最新文章', viewArchive: '查看归档 →', all: '全部', featured: '精选',
    pinned: '置顶', tags: '标签', categories: '分类', archives: '归档', about: '关于', search: '搜索',
    links: '链接', comments: '评论', skipToContent: '跳转到正文', builtWith: '由 Aurora 构建。', newer: '← 较新', older: '较旧 →',
    articles: '文章', article: '文章', previous: '上一篇', next: '下一篇', previousArticle: '上一篇文章', nextArticle: '下一篇文章',
    readMore: '阅读更多', published: '发布于', updated: '更新于', author: '作者', theme: '主题', language: '语言',
    menu: '菜单', close: '关闭', openSearch: '打开搜索', searchPlaceholder: '搜索 Aurora……',
    searchStart: '在静态生成的 Aurora 归档中搜索。', searching: '搜索中……',
    searchUnavailable: '当前构建没有可用的搜索索引。', noResults: '没有结果。', clearSearch: '清除搜索',
    pagefindIndex: 'Pagefind 索引', typeToSearch: '输入以搜索', copy: '复制', copied: '已复制', contents: '目录',
    timeline: '时间线', taxonomy: '分类索引', tag: '标签', category: '分类', defaultCategory: 'Aurora',
    noRecentComments: '暂无最新评论', noFriendLinks: '尚未配置友链',
    linksDescription: '此静态页面可在配置友链后使用，不会虚构外部记录。',
    friends: '朋友与链接', connectCreators: '与 Aurora 创作者交流', noJsFallback: '打开搜索页面',
    useLightTheme: '切换浅色主题', useDarkTheme: '切换深色主题', openMenu: '打开菜单', closeMenu: '关闭菜单',
    switchTo: '切换到', docs: '文档', github: 'GitHub', primaryNavigation: '主要导航',
    closeImage: '关闭图片', unavailable: '不可用', brandDescription: '使用原始 Aurora 光芒表达未来感出版。',
    rightsReserved: '版权所有。', originalVisualSystem: '原始视觉系统来自',
    tableOfContents: '目录', minutes: '分钟', words: '字', notFoundTitle: '找不到页面',
    notFoundMessage: '你访问的页面不存在。', featuredArticles: '精选文章', editorSelection: '编辑精选',
    recommended: '推荐', poweredBy: '由', themedBy: '主题来自', pageViews: '页面浏览', uniqueVisitors: '独立访客',
    siteRunningFor: '站点已运行', day: '天', demoStats: 'Demo 展示数据', projects: '项目', resources: '资源',
    linksIntro: '为本次 Showcase 整理的项目与资源链接。',
    aboutIntro: 'Aurora 3 提供静态 HTML、多语言内容、聚焦交互岛和构建期 Markdown 管线。',
    homeAction: '返回首页', searchAction: '搜索归档', noCommentsConfigured: '本站尚未配置评论服务。',
    commentLoading: '评论加载中……', commentSetupMissing: '所选评论服务尚未完成配置。',
    commentLoadError: '评论暂时无法加载，文章内容仍可正常阅读。', commentsRequireJavaScript: '评论服务需要 JavaScript，文章内容仍可正常阅读。',
    recentCommentsLoadError: '最新评论暂时无法加载。', recentCommentsLoading: '最新评论加载中……',
    filing: '备案信息', policeFiling: '公安备案',
  },
}

export function normalizeLocale(value: string | undefined): AuroraLocale {
  return value?.toLowerCase() === 'zh-cn' || value?.toLowerCase() === 'cn' ? 'zh-CN' : defaultLocale
}

export function messagesFor(locale: AuroraLocale): AuroraMessages { return messages[locale] }

export function t(locale: AuroraLocale, key: keyof AuroraMessages): string {
  return messagesFor(locale)[key]
}

export function localeFromSegment(segment: string | undefined): AuroraLocale | undefined {
  if (!segment) return undefined
  return segment.toLowerCase() === localeSegments['zh-CN'] ? 'zh-CN' : segment === '' ? 'en' : undefined
}

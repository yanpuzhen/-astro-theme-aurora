import { defaultLocale, messagesFor, type AuroraLocale } from './i18n'
import { localizedSitePath } from './routing'

export interface AuroraConfig {
  site: {
    title: string
    subtitle: string
    author: string
    avatar: string
    startedDate: string
    description: string
    language: AuroraLocale
  }
  theme: { feature: boolean; darkMode: boolean; profileShape: 'circle' | 'diamond' | 'rounded'; colors: [string, string, string] }
  menu: { label: string; href: string }[]
  statistics: { pageViews: string; uniqueVisitors: string }
  beian: { number: string; link: string; policeNumber: string; policeLink: string }
  comments: { provider: 'gitalk' | 'valine' | 'twikoo' | 'waline' | 'none'; enabled: boolean; gitalkIdMode: 'uid' | 'pathname' }
}

const configuredProvider = import.meta.env.PUBLIC_COMMENT_PROVIDER
const defaultLabels = messagesFor(defaultLocale)
const provider = configuredProvider === 'gitalk' || configuredProvider === 'valine' || configuredProvider === 'twikoo' || configuredProvider === 'waline' ? configuredProvider : 'none'

export const config: AuroraConfig = {
  site: {
    title: 'Aurora 3.0', subtitle: 'Futuristic auroral theme powered by Astro', author: 'Aurora',
    avatar: import.meta.env.PUBLIC_AURORA_AVATAR || '',
    startedDate: import.meta.env.PUBLIC_AURORA_STARTED_DATE || '',
    description: 'A static-first Aurora theme for expressive, multilingual publishing.', language: defaultLocale,
  },
  theme: {
    feature: true, darkMode: true, profileShape: 'diamond',
    colors: ['#24c6dc', '#5433ff', '#ff0099'],
  },
  menu: [
    { label: defaultLabels.home, href: '/' }, { label: defaultLabels.tags, href: '/tags/' },
    { label: defaultLabels.categories, href: '/categories/' }, { label: defaultLabels.archives, href: '/archives/' },
    { label: defaultLabels.about, href: '/about/' },
  ],
  statistics: { pageViews: import.meta.env.PUBLIC_AURORA_PAGE_VIEWS || '', uniqueVisitors: import.meta.env.PUBLIC_AURORA_UNIQUE_VISITORS || '' },
  beian: {
    number: import.meta.env.PUBLIC_AURORA_BEIAN_NUMBER || '', link: import.meta.env.PUBLIC_AURORA_BEIAN_LINK || '',
    policeNumber: import.meta.env.PUBLIC_AURORA_POLICE_BEIAN_NUMBER || '', policeLink: import.meta.env.PUBLIC_AURORA_POLICE_BEIAN_LINK || '',
  },
  comments: { provider, enabled: provider !== 'none', gitalkIdMode: import.meta.env.PUBLIC_GITALK_ID_MODE === 'pathname' ? 'pathname' : 'uid' },
}

export function menuFor(locale: AuroraLocale) {
  const labels = messagesFor(locale)
  return [
    { label: labels.home, href: localizedSitePath('/', locale) },
    { label: labels.tags, href: localizedSitePath('/tags/', locale) },
    { label: labels.categories, href: localizedSitePath('/categories/', locale) },
    { label: labels.archives, href: localizedSitePath('/archives/', locale) },
    { label: labels.about, href: localizedSitePath('/about/', locale) },
    { label: labels.docs, href: `https://yanpuzhen.github.io/astro-theme-aurora/${locale === defaultLocale ? '' : 'cn/'}` },
    { label: labels.github, href: 'https://github.com/yanpuzhen/astro-theme-aurora' },
  ]
}

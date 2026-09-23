import { messagesFor, type AuroraLocale } from './i18n'
import { localizedSitePath } from './routing'
import { loadAuroraConfig, type AuroraConfig } from './config-loader'
import { demoProfile } from './showcase'

export type { AuroraConfig } from './config-loader'

/** Parsed once per build process; Astro components only consume normalized values. */
const loadedConfig = loadAuroraConfig()
const isDemoBuild = process.env.ASTRO_DEMO_BUILD === 'true'
export const config: AuroraConfig = isDemoBuild
  ? Object.freeze({
      ...loadedConfig,
      site: Object.freeze({
        ...loadedConfig.site,
        title: 'Aurora 3.0',
        subtitle: 'AURORA 3.0',
        author: demoProfile.en.name,
        description: 'A static-first Aurora theme showcase.',
        avatar: demoProfile.en.avatar,
      }),
      menu: Object.freeze({ ...loadedConfig.menu, links: true }),
      comments: Object.freeze({
        ...loadedConfig.comments,
        provider: 'none',
        enabled: false,
        recentComments: Object.freeze({ ...loadedConfig.comments.recentComments, enabled: false }),
      }),
    }) as AuroraConfig
  : loadedConfig

const routeKeys = ['home', 'tags', 'categories', 'archives', 'about', 'links'] as const
const paths = {
  home: '/', tags: '/tags/', categories: '/categories/', archives: '/archives/', about: '/about/', links: '/links/',
} as const

export function menuFor(locale: AuroraLocale) {
  const labels = messagesFor(locale)
  return routeKeys.flatMap((key) => config.menu[key]
    ? [{ label: labels[key], href: localizedSitePath(paths[key], locale) }]
    : [])
}

export function profileShapeClass(): string {
  return config.theme.profileShape === 'diamond' ? 'diamond-avatar' : `profile-shape-${config.theme.profileShape}`
}

import type { CollectionEntry } from 'astro:content'
import { categorySlug, slugify } from './content.ts'
import { defaultLocale, localeSegments, type AuroraLocale } from './i18n.ts'

const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}

export type PostEntry = CollectionEntry<'posts'>
export type RouteMode = 'slug' | 'uid' | 'explicit'
export interface RouteOptions { mode?: RouteMode; base?: string; htmlExtension?: boolean; locale?: AuroraLocale }
export interface RouteManifestEntry {
  id: string; title: string; canonicalPath: string; canonicalUrlPath: string; aliases: string[]
  legacyUid: string; commentId: string; commentPath: string
  locale: AuroraLocale; translationKey?: string
}

function basePath(base: string): string {
  const normalized = cleanPath(base)
  return normalized === '/' ? '/' : normalized.replace(/\/$/, '')
}

function cleanPath(path: string): string {
  const withoutOrigin = path.replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '')
  const withoutQuery = withoutOrigin.split(/[?#]/, 1)[0] || '/'
  return `/${withoutQuery.replace(/^\/+/, '').replace(/\/+/g, '/')}`
}

export function normalizeRoutePath(path: string): string {
  const normalized = cleanPath(path)
  if (normalized === '/' || normalized.endsWith('.html')) return normalized
  return `${normalized.replace(/\/+$/, '')}/`
}

export function withBase(path: string, base = astroEnv.BASE_URL || '/'): string {
  const normalizedPath = normalizeRoutePath(path)
  const normalizedBase = basePath(base)
  if (normalizedBase === '/' || normalizedPath === normalizedBase || normalizedPath.startsWith(`${normalizedBase}/`)) return normalizedPath
  return normalizeRoutePath(`${normalizedBase}${normalizedPath}`)
}

export function withoutBase(path: string, base = astroEnv.BASE_URL || '/'): string {
  const normalized = normalizeRoutePath(path)
  const normalizedBase = basePath(base)
  if (normalizedBase === '/' || (normalized !== normalizedBase && !normalized.startsWith(`${normalizedBase}/`))) return normalized
  return normalizeRoutePath(normalized.slice(normalizedBase.length))
}

export function sitePath(path: string): string { return withBase(path) }

export function localeFromPath(path: string): AuroraLocale {
  const normalized = withoutBase(path)
  return normalized === '/cn/' || normalized.startsWith('/cn/') ? 'zh-CN' : defaultLocale
}

export function stripLocalePath(path: string): string {
  const normalized = normalizeRoutePath(withoutBase(path))
  return normalized === '/cn/' ? '/' : normalized.startsWith('/cn/') ? normalizeRoutePath(normalized.slice('/cn'.length)) : normalized
}

export function localePath(path: string, locale: AuroraLocale): string {
  const unprefixed = stripLocalePath(path)
  const segment = localeSegments[locale]
  return normalizeRoutePath(segment ? `/${segment}${unprefixed}` : unprefixed)
}

export function localizedSitePath(path: string, locale: AuroraLocale): string {
  return sitePath(localePath(path, locale))
}

export function assetPath(path: string, base = astroEnv.BASE_URL || '/'): string {
  const clean = path.replace(/^\/+/, '')
  const cleanBase = base === '/' ? '' : base.replace(/^\/+|\/+$/g, '')
  return `/${[cleanBase, clean].filter(Boolean).join('/')}`
}

export function publicAssetPath(path: string, base = astroEnv.BASE_URL || '/'): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|data:|#)/i.test(path)) return path
  return assetPath(path, base)
}

function defaultMode(post: PostEntry): RouteMode {
  if (post.data.permalink) return 'explicit'
  if (post.data.permalinkMode === 'uid') return 'uid'
  if (post.data.permalinkMode === 'explicit') return 'explicit'
  return astroEnv.ASTRO_PATH_SLUG === 'uid' ? 'uid' : 'slug'
}

export function postSlug(post: PostEntry, mode: RouteMode = defaultMode(post)): string {
  if (mode === 'uid') return post.data.legacyUid
  return post.data.slug || post.id.replace(/\.[^/.]+$/, '')
}

export function resolvePostPath(post: PostEntry, options: RouteOptions = {}): string {
  const mode = options.mode ?? defaultMode(post)
  if (mode === 'explicit' && post.data.permalink) return localePath(post.data.permalink, options.locale || defaultLocale)
  const path = `/post/${postSlug(post, mode)}`
  return localePath(normalizeRoutePath(options.htmlExtension ? `${path}.html` : path), options.locale || defaultLocale)
}

export function postPath(post: PostEntry, options: RouteOptions = {}): string {
  return sitePath(resolvePostPath(post, options))
}

export function postAliases(post: PostEntry): string[] {
  return postAliasesForLocale(post, defaultLocale)
}

export function postAliasesForLocale(post: PostEntry, locale: AuroraLocale): string[] {
  const canonical = resolvePostPath(post, { locale })
  const aliases = new Set<string>(post.data.legacyPermalinks.map((path) => localePath(path, locale)))
  const slugPath = resolvePostPath(post, { mode: 'slug', locale })
  const uidPath = resolvePostPath(post, { mode: 'uid', locale })
  aliases.add(`${slugPath.replace(/\/$/, '')}.html`)
  if (uidPath !== canonical) aliases.add(uidPath)
  if (slugPath !== canonical) aliases.add(slugPath)
  aliases.delete(canonical)
  return [...aliases]
}

export function routeManifestEntry(post: PostEntry): RouteManifestEntry {
  return routeManifestEntryForLocale(post, defaultLocale)
}

export function routeManifestEntryForLocale(post: PostEntry, locale: AuroraLocale): RouteManifestEntry {
  const canonicalPath = resolvePostPath(post, { locale })
  const historicalPath = post.data.legacyPermalinks.find((path) => path.startsWith('/'))
  const explicitCommentPath = post.data.commentPath
  const commentPath = normalizeRoutePath(explicitCommentPath || (locale === defaultLocale ? historicalPath || canonicalPath : canonicalPath))
  return {
    id: post.id, title: post.data.title, canonicalPath, canonicalUrlPath: sitePath(canonicalPath),
    aliases: postAliasesForLocale(post, locale), legacyUid: post.data.legacyUid,
    commentId: post.data.commentId || (locale === defaultLocale ? post.data.legacyUid : `${post.data.legacyUid}:${locale}`), commentPath,
    locale, translationKey: post.data.translationKey,
  }
}

const RESERVED_ROUTE_PREFIXES = ['/tags/', '/categories/', '/archives/', '/search/', '/about/', '/links/', '/page/']

/** Fail the build instead of silently selecting whichever entry was visited last. */
export function assertNoRouteCollisions(posts: PostEntry[]): void {
  const claimed = new Map<string, string>()
  for (const post of posts) {
    const paths = [resolvePostPath(post), ...postAliases(post)]
    for (const path of paths) {
      const normalized = normalizeRoutePath(path)
      const previous = claimed.get(normalized)
      if (previous && previous !== post.id) {
        throw new Error(`Route collision: ${normalized} is claimed by ${previous} and ${post.id}`)
      }
      claimed.set(normalized, post.id)
      if (RESERVED_ROUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
        throw new Error(`Route collision: ${normalized} for ${post.id} overlaps a reserved site route`)
      }
    }
  }
}

export function tagPath(name: string, locale = defaultLocale): string { return localizedSitePath(`/tags/${slugify(name)}/`, locale) }
export function categoryPath(name: string, locale = defaultLocale): string { return localizedSitePath(`/categories/${categorySlug(name)}/`, locale) }
export function pagePath(page: number, locale = defaultLocale): string { return localizedSitePath(page <= 1 ? '/' : `/page/${page}/`, locale) }
export function customPagePath(slug: string, locale = defaultLocale): string { return localizedSitePath(`/page/${slug}/`, locale) }
export function archivePath(page = 1, locale = defaultLocale): string { return localizedSitePath(page <= 1 ? '/archives/' : `/archives/${page}/`, locale) }

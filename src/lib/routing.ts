import type { CollectionEntry } from 'astro:content'
import { categorySlug, slugify } from './content.ts'

const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}

export type PostEntry = CollectionEntry<'posts'>
export type RouteMode = 'slug' | 'uid' | 'explicit'
export interface RouteOptions { mode?: RouteMode; base?: string; htmlExtension?: boolean }
export interface RouteManifestEntry {
  id: string; title: string; canonicalPath: string; canonicalUrlPath: string; aliases: string[]
  legacyUid: string; commentId: string; commentPath: string
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
  if (mode === 'explicit' && post.data.permalink) return normalizeRoutePath(post.data.permalink)
  const path = `/post/${postSlug(post, mode)}`
  return normalizeRoutePath(options.htmlExtension ? `${path}.html` : path)
}

export function postPath(post: PostEntry, options: RouteOptions = {}): string {
  return sitePath(resolvePostPath(post, options))
}

export function postAliases(post: PostEntry): string[] {
  const canonical = resolvePostPath(post)
  const aliases = new Set<string>(post.data.legacyPermalinks.map(normalizeRoutePath))
  const slugPath = resolvePostPath(post, { mode: 'slug' })
  const uidPath = resolvePostPath(post, { mode: 'uid' })
  aliases.add(`${slugPath.replace(/\/$/, '')}.html`)
  if (uidPath !== canonical) aliases.add(uidPath)
  if (slugPath !== canonical) aliases.add(slugPath)
  aliases.delete(canonical)
  return [...aliases]
}

export function routeManifestEntry(post: PostEntry): RouteManifestEntry {
  const canonicalPath = resolvePostPath(post)
  const historicalPath = post.data.legacyPermalinks.find((path) => path.startsWith('/'))
  const commentPath = normalizeRoutePath(post.data.commentPath || historicalPath || canonicalPath)
  return {
    id: post.id, title: post.data.title, canonicalPath, canonicalUrlPath: sitePath(canonicalPath),
    aliases: postAliases(post), legacyUid: post.data.legacyUid,
    commentId: post.data.commentId || post.data.legacyUid, commentPath,
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

export function tagPath(name: string): string { return sitePath(`/tags/${slugify(name)}/`) }
export function categoryPath(name: string): string { return sitePath(`/categories/${categorySlug(name)}/`) }
export function pagePath(page: number): string { return sitePath(page <= 1 ? '/' : `/page/${page}/`) }
export function customPagePath(slug: string): string { return sitePath(`/page/${slug}/`) }
export function archivePath(page = 1): string { return sitePath(page <= 1 ? '/archives/' : `/archives/${page}/`) }

import { legacyUid } from './legacy-identity.ts'

export interface AuthorData {
  name: string
  slug: string
  avatar: string
  link: string
  description: string
  socials: Record<string, string | Record<string, string>>
}

export interface NormalizedPostData {
  title: string
  date: Date
  updated?: Date
  tags: string[]
  categories: string[]
  cover?: string
  description?: string
  excerpt?: string
  keywords: string[]
  author: AuthorData
  feature: boolean
  pinned: boolean
  slug?: string
  permalink?: string
  permalinkMode: 'slug' | 'uid' | 'explicit'
  uid: string
  legacyUid: string
  legacyPermalinks: string[]
  photos: string[]
  toc: boolean | string
  comments: boolean
  commentId?: string
  commentPath?: string
  lang: string
  hidden: boolean
  published: boolean
  draft: boolean
  rawHtml: boolean
  demo: boolean
  preview?: number
  extras: Record<string, unknown>
}

const KNOWN_FIELDS = new Set([
  'title', 'date', 'updated', 'tags', 'categories', 'cover', 'description', 'excerpt',
  'abstracts', 'preview', 'keywords', 'author', 'feature', 'sticky', 'pinned', 'slug',
  'permalink', 'permalinkMode', 'uid', 'legacyUid', 'legacyPermalink', 'legacyPermalinks',
  'aliases', 'photos', 'toc', 'comment', 'comments', 'commentId', 'commentPath', 'lang',
  'hidden', 'published', 'draft', 'rawHtml', 'allowHtml', 'type', 'categoryMode', 'data', 'demo',
])

export function asStringList(value: unknown): string[] {
  if (value == null || value === '') return []
  const values = Array.isArray(value) ? value : [value]
  return values.flatMap((item) => (Array.isArray(item) ? item : [item]))
    .map((item) => String(item).trim()).filter(Boolean)
}

export function asBoolean(value: unknown, fallback: boolean): boolean {
  if (value == null || value === '') return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    if (/^(false|no|off|0)$/i.test(value.trim())) return false
    if (/^(true|yes|on|1)$/i.test(value.trim())) return true
  }
  return Boolean(value)
}

export function slugify(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase()
    .replace(/\+\+/g, '-plus-plus').replace(/#/g, '-sharp')
    .replace(/[\s_]+/g, '-').replace(/[^\p{L}\p{N}\-/]+/gu, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export function categorySlug(value: string): string {
  return value.split('/').map((part) => slugify(part)).filter(Boolean).join('/')
}

function normalizeAuthor(value: unknown): AuthorData {
  const fallback: AuthorData = {
    name: 'Aurora', slug: 'blog-author', avatar: '', link: '/', description: '', socials: {},
  }
  if (typeof value === 'string' && value.trim()) {
    return { ...fallback, name: value.trim(), slug: slugify(value) || fallback.slug }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback
  const author = value as Record<string, unknown>
  const name = String(author.name ?? fallback.name).trim() || fallback.name
  return {
    name, slug: String((author.slug ?? slugify(name)) || fallback.slug),
    avatar: String(author.avatar ?? fallback.avatar), link: String(author.link ?? fallback.link),
    description: String(author.description ?? fallback.description),
    socials: author.socials && typeof author.socials === 'object'
      ? (author.socials as Record<string, string | Record<string, string>>) : {},
  }
}

function firstString(value: unknown): string | undefined {
  return asStringList(value)[0]
}

export function normalizeLegacyData(
  raw: Record<string, unknown>, kind: 'post' | 'page' = 'post',
): NormalizedPostData {
  // Hexo hashes the title exactly as parsed. Do not trim or normalize it here:
  // whitespace and combining-character differences are part of the legacy key.
  const title = String(raw.title ?? '')
  const explicitUid = firstString(raw.legacyUid) ?? firstString(raw.uid)
  const uid = explicitUid || legacyUid(title, kind)
  const permalink = firstString(raw.permalink)
  const rawMode = firstString(raw.permalinkMode)
  const permalinkMode: NormalizedPostData['permalinkMode'] = permalink || rawMode === 'explicit'
    ? 'explicit' : rawMode === 'uid' ? 'uid' : 'slug'
  const aliases = [
    ...asStringList(raw.legacyPermalink), ...asStringList(raw.legacyPermalinks), ...asStringList(raw.aliases),
  ]
  const extras = Object.fromEntries(Object.entries(raw).filter(([key]) => !KNOWN_FIELDS.has(key)))
  return {
    title,
    date: raw.date instanceof Date ? raw.date : new Date(String(raw.date)),
    updated: raw.updated == null ? undefined : new Date(String(raw.updated)),
    tags: asStringList(raw.tags), categories: asStringList(raw.categories), cover: firstString(raw.cover),
    description: firstString(raw.description), excerpt: firstString(raw.excerpt) ?? firstString(raw.abstracts),
    keywords: asStringList(raw.keywords), author: normalizeAuthor(raw.author),
    feature: asBoolean(raw.feature, false), pinned: asBoolean(raw.pinned ?? raw.sticky, false),
    slug: firstString(raw.slug), permalink, permalinkMode, uid, legacyUid: uid, legacyPermalinks: aliases,
    photos: asStringList(raw.photos),
    toc: typeof raw.toc === 'string' || typeof raw.toc === 'boolean' ? raw.toc : false,
    comments: asBoolean(raw.comment ?? raw.comments, true), commentId: firstString(raw.commentId),
    commentPath: firstString(raw.commentPath), lang: firstString(raw.lang) || 'en',
    hidden: asBoolean(raw.hidden, false), published: asBoolean(raw.published, true),
    draft: asBoolean(raw.draft, false), rawHtml: asBoolean(raw.rawHtml ?? raw.allowHtml, true),
    demo: asBoolean(raw.demo, false),
    preview: typeof raw.preview === 'number' ? raw.preview : undefined, extras,
  }
}

export function isPublicPost(post: { data: Pick<NormalizedPostData, 'hidden' | 'published' | 'draft' | 'demo'> }): boolean {
  const demoBuild = process.env.ASTRO_DEMO_BUILD === 'true'
  const demo = post.data.demo
  return post.data.published && !post.data.hidden && !post.data.draft && (!demoBuild || demo)
}

export function excerptFromBody(body: string, limit = 160): string {
  const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]*>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text
}

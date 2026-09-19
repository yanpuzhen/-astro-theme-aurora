import type { CollectionEntry } from 'astro:content'
import { excerptFromBody, isPublicPost } from './content'

export type Post = CollectionEntry<'posts'>
export interface HomeSelection { posts: Post[]; features: Post[]; mode: 'feature' | 'pin' }
export interface PageSlice<T> { items: T[]; page: number; pageSize: number; pageCount: number; total: number }

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => (b.data.date.valueOf() - a.data.date.valueOf()) || a.id.localeCompare(b.id))
}

export function publicPosts(posts: Post[]): Post[] { return posts.filter(isPublicPost) }

export function selectHomePosts(posts: Post[], featureEnabled = true): HomeSelection {
  const sorted = sortByDate(publicPosts(posts))
  const capacity = 3
  if (!featureEnabled || sorted.length < capacity) {
    return { posts: sorted, features: sorted.slice(0, 1), mode: 'pin' }
  }
  const selected: Post[] = []
  const selectedIds = new Set<string>()
  for (const post of sorted) {
    if (post.data.feature && selected.length < capacity) { selected.push(post); selectedIds.add(post.id) }
  }
  for (const post of sorted) {
    if (selected.length >= capacity) break
    if (!selectedIds.has(post.id)) { selected.push(post); selectedIds.add(post.id) }
  }
  const features = [...selected].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  return { posts: [...features, ...sorted.filter((post) => !selectedIds.has(post.id))], features, mode: 'feature' }
}

export function paginate<T>(items: T[], page: number, pageSize: number): PageSlice<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const pageCount = Math.max(1, Math.ceil(items.length / safePageSize))
  const safePage = Math.min(Math.max(1, Math.floor(page)), pageCount)
  return { items: items.slice((safePage - 1) * safePageSize, safePage * safePageSize), page: safePage,
    pageSize: safePageSize, pageCount, total: items.length }
}

export function excerptFor(post: Post): string { return post.data.excerpt || excerptFromBody(post.body || '', post.data.preview || 160) }
export function archivePosts(posts: Post[]): Post[] { return sortByDate(publicPosts(posts)) }

export function previousNext(posts: Post[], current: Post): { previous?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.id === current.id)
  return { previous: index > 0 ? posts[index - 1] : undefined, next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined }
}

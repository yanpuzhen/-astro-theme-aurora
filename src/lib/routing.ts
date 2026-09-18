import type { CollectionEntry } from 'astro:content'

/** The first implementation keeps the resolver deliberately small; future modes belong here. */
export function postSlug(post: CollectionEntry<'posts'>): string {
  return post.data.slug ?? post.id.replace(/\.[^/.]+$/, '')
}

export function postPath(post: CollectionEntry<'posts'>): string {
  return `${import.meta.env.BASE_URL}post/${postSlug(post)}/`
}

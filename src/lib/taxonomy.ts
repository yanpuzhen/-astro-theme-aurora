import type { CollectionEntry } from 'astro:content'
import { categorySlug, slugify } from './content'

export type Post = CollectionEntry<'posts'>
export interface TaxonomyItem { name: string; slug: string; posts: Post[] }

function collect(posts: Post[], field: 'tags' | 'categories'): TaxonomyItem[] {
  const groups = new Map<string, TaxonomyItem>()
  for (const post of posts) {
    for (const name of post.data[field]) {
      const slug = field === 'categories' ? categorySlug(name) : slugify(name)
      if (!slug) continue
      const item = groups.get(slug) || { name, slug, posts: [] }
      item.posts.push(post)
      groups.set(slug, item)
    }
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function collectTags(posts: Post[]): TaxonomyItem[] { return collect(posts, 'tags') }
export function collectCategories(posts: Post[]): TaxonomyItem[] { return collect(posts, 'categories') }

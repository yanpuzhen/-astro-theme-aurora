import { getCollection } from 'astro:content'
import { isPublicPost } from '../lib/content'
import { collectCategories, collectTags } from '../lib/taxonomy'
import { archivePosts } from '../lib/posts'
import { categoryPath, routeManifestEntry, sitePath, tagPath } from '../lib/routing'

export const prerender = true
export async function GET({ site }: { site?: URL }) {
  const posts = archivePosts((await getCollection('posts')).filter(isPublicPost))
  const urls = new Set(['/','/about/','/links/','/tags/','/categories/','/archives/','/search/'])
  for (const post of posts) urls.add(routeManifestEntry(post).canonicalPath)
  for (const tag of collectTags(posts)) urls.add(tagPath(tag.name))
  for (const category of collectCategories(posts)) urls.add(categoryPath(category.name))
  const origin = site?.toString() || 'https://example.com/'
  const body = [...urls].map((path) => `<url><loc>${new URL(sitePath(path), origin).toString()}</loc></url>`).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}

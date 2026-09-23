import { getCollection, type CollectionEntry } from 'astro:content'
import { isLocale, isPublicPost, isSitemapPost } from '../lib/content'
import { collectCategories, collectTags } from '../lib/taxonomy'
import { archivePosts } from '../lib/posts'
import { config } from '../lib/config'
import { selectHomePosts } from '../lib/posts'
import { categoryPath, customPagePath, archivePath, pagePath, routeManifestEntry, routeManifestEntryForLocale, sitePath, tagPath } from '../lib/routing'
import type { AuroraLocale } from '../lib/i18n'

export const prerender = true
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] || char)

export async function GET({ site }: { site?: URL }) {
  const publicPosts = (await getCollection('posts')).filter(isPublicPost)
  const allPosts = publicPosts.filter(isSitemapPost)
  const english = archivePosts(publicPosts.filter((post) => isLocale(post, 'en')))
  const chinese = archivePosts(publicPosts.filter((post) => isLocale(post, 'zh-CN')))
  const englishSitemap = new Set(archivePosts(allPosts.filter((post) => isLocale(post, 'en'))).map((post) => post.id))
  const chineseSitemap = new Set(archivePosts(allPosts.filter((post) => isLocale(post, 'zh-CN'))).map((post) => post.id))
  const urls = new Set(['/','/about/','/links/','/tags/','/categories/','/archives/','/search/','/cn/','/cn/about/','/cn/links/','/cn/tags/','/cn/categories/','/cn/archives/','/cn/search/'])
  const addPagination = (posts: CollectionEntry<'posts'>[], locale: AuroraLocale) => {
    const selection = selectHomePosts(posts, config.theme.feature)
    const pageSize = selection.mode === 'feature' ? 12 : 13
    const pageCount = Math.ceil(selection.posts.length / pageSize)
    for (let page = 2; page <= pageCount; page += 1) urls.add(pagePath(page, locale))
  }
  const addArchivePagination = (posts: CollectionEntry<'posts'>[], locale: AuroraLocale) => {
    const pageCount = Math.ceil(posts.length / 12)
    for (let page = 2; page <= pageCount; page += 1) urls.add(archivePath(page, locale))
  }
  addPagination(english, 'en'); addPagination(chinese, 'zh-CN')
  addArchivePagination(english, 'en'); addArchivePagination(chinese, 'zh-CN')
  for (const post of english) if (englishSitemap.has(post.id)) urls.add(routeManifestEntry(post).canonicalPath)
  for (const post of chinese) if (chineseSitemap.has(post.id)) urls.add(routeManifestEntryForLocale(post, 'zh-CN').canonicalPath)
  for (const tag of collectTags(english)) urls.add(tagPath(tag.name))
  for (const tag of collectTags(chinese)) urls.add(tagPath(tag.name, 'zh-CN'))
  for (const category of collectCategories(english)) urls.add(categoryPath(category.name))
  for (const category of collectCategories(chinese)) urls.add(categoryPath(category.name, 'zh-CN'))
  for (const page of (await getCollection('pages')).filter(isPublicPost).filter(isSitemapPost).filter((entry) => entry.id !== 'about' && isLocale(entry, 'en'))) urls.add(customPagePath(page.id, 'en'))
  for (const page of (await getCollection('pages')).filter(isPublicPost).filter(isSitemapPost).filter((entry) => entry.id !== 'about' && isLocale(entry, 'zh-CN'))) urls.add(customPagePath(page.id, 'zh-CN'))
  const origin = site?.toString() || 'https://example.com/'
  const body = [...urls].map((path) => `<url><loc>${escapeXml(new URL(sitePath(path), origin).toString())}</loc></url>`).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}

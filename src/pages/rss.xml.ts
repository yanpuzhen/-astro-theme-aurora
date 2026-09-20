import { getCollection } from 'astro:content'
import { config } from '../lib/config'
import { isPublicPost } from '../lib/content'
import { archivePosts } from '../lib/posts'
import { routeManifestEntry, sitePath } from '../lib/routing'
import { isLocale } from '../lib/content'

export const prerender = true
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] || char)

export async function GET({ site }: { site?: URL }) {
  const posts = archivePosts((await getCollection('posts')).filter(isPublicPost).filter((post) => isLocale(post, 'en')))
  const origin = site?.toString() || 'https://example.com/'
  const items = posts.map((post) => {
    const route = routeManifestEntry(post)
    const link = new URL(sitePath(route.canonicalPath), origin).toString()
    return `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description || (post.body || '').slice(0, 240))}</description></item>`
  }).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(config.site.title)}</title><link>${escapeXml(origin)}</link><description>${escapeXml(config.site.description)}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

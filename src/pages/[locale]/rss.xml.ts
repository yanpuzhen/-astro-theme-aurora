import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { config } from '../../lib/config'
import { isFeedPost, isLocale, excerptFromBody } from '../../lib/content'
import { archivePosts } from '../../lib/posts'
import { routeManifestEntryForLocale, sitePath } from '../../lib/routing'

export const prerender = true

export function getStaticPaths() { return [{ params: { locale: 'cn' } }] }

function uniqueFeedPosts<T extends { id: string; data: { translationKey?: string } }>(posts: T[]): T[] {
  const seen = new Set<string>()
  return posts.filter((post) => {
    const key = post.data.translationKey ? `translation:${post.data.translationKey}` : `entry:${post.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function GET({ site }: { site?: URL }) {
  const posts = uniqueFeedPosts(archivePosts((await getCollection('posts'))
    .filter(isFeedPost)
    .filter((post) => isLocale(post, 'zh-CN'))))
  const origin = site || new URL(config.site.url)
  return rss({
    title: `${config.site.title} · 简体中文`,
    description: config.site.description,
    site: new URL(sitePath('/cn/'), origin),
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: excerptFromBody(post.data.description || post.body || '', post.data.preview || 240),
      pubDate: post.data.date,
      link: new URL(sitePath(routeManifestEntryForLocale(post, 'zh-CN').canonicalPath), origin).toString(),
      categories: post.data.categories,
      author: post.data.author.name,
    })),
  })
}

import { getCollection } from 'astro:content'
import { isPublicPost } from '../lib/content'
import { assertNoRouteCollisions, routeManifestEntry, routeManifestEntryForLocale } from '../lib/routing'
import { isLocale } from '../lib/content'
export const prerender = true
export async function GET() {
  const posts = await getCollection('posts', isPublicPost)
  const english = posts.filter((post) => isLocale(post, 'en'))
  const chinese = posts.filter((post) => isLocale(post, 'zh-CN'))
  assertNoRouteCollisions(english)
  assertNoRouteCollisions(chinese)
  return new Response(JSON.stringify([
    ...english.map(routeManifestEntry), ...chinese.map((post) => routeManifestEntryForLocale(post, 'zh-CN')),
  ], null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}

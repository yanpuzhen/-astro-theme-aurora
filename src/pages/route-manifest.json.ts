import { getCollection } from 'astro:content'
import { isPublicPost } from '../lib/content'
import { assertNoRouteCollisions, routeManifestEntry } from '../lib/routing'
export const prerender = true
export async function GET() {
  const posts = await getCollection('posts', isPublicPost)
  assertNoRouteCollisions(posts)
  return new Response(JSON.stringify(posts.map(routeManifestEntry), null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}

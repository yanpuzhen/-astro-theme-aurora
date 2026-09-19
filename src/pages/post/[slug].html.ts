import { getCollection } from 'astro:content'
import { isPublicPost } from '../../lib/content'
import { postAliases, postPath } from '../../lib/routing'

export const prerender = true
export async function getStaticPaths() {
  const entries = await getCollection('posts', isPublicPost)
  const paths = new Map<string, typeof entries[number]>()
  for (const post of entries) {
    for (const alias of postAliases(post).filter((value) => value.startsWith('/post/') && value.endsWith('.html'))) paths.set(alias, post)
  }
  return [...paths.entries()].map(([alias, post]) => ({
    params: { slug: alias.replace(/^\/post\//, '').replace(/\.html$/, '') }, props: { post },
  }))
}

export function GET({ props, site }: { props: { post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number] }; site?: URL }) {
  const { post } = props
  const destination = new URL(postPath(post), site || 'https://example.com/')
  const canonical = new URL(postPath(post), site || 'https://example.com/')
  const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${escape(destination.toString())}"><link rel="canonical" href="${escape(canonical.toString())}"><title>Moved · ${escape(post.data.title)}</title></head><body><p>This article moved. <a href="${escape(destination.toString())}">${escape(post.data.title)}</a></p></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

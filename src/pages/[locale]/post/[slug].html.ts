import { getCollection } from 'astro:content'
import { isLocale, isPublicPost } from '../../../lib/content'
import { normalizeLocale } from '../../../lib/i18n'
import { assertNoRouteCollisions, postAliasesForLocale, postPath } from '../../../lib/routing'

export const prerender = true

export async function getStaticPaths() {
  const locale = 'zh-CN' as const
  const entries = (await getCollection('posts', isPublicPost)).filter((post) => isLocale(post, locale))
  assertNoRouteCollisions(entries)
  const paths = new Map<string, typeof entries[number]>()
  for (const post of entries) {
    for (const alias of postAliasesForLocale(post, locale).filter((value) => value.startsWith('/cn/post/') && value.endsWith('.html'))) {
      paths.set(alias, post)
    }
  }
  return [...paths.entries()].map(([alias, post]) => ({
    params: { locale: 'cn', slug: alias.replace(/^\/cn\/post\//, '').replace(/\.html$/, '') }, props: { post },
  }))
}

export function GET({ props, site }: { props: { post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number] }; site?: URL }) {
  const { post } = props
  const destination = new URL(postPath(post, { locale: normalizeLocale('zh-CN') }), site || 'https://example.com/')
  const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char)
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${escape(destination.toString())}"><link rel="canonical" href="${escape(destination.toString())}"><title>Moved · ${escape(post.data.title)}</title></head><body><p>文章已移动。 <a href="${escape(destination.toString())}">${escape(post.data.title)}</a></p></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

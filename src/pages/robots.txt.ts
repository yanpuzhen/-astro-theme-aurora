import { assetPath } from '../lib/routing'
import { config } from '../lib/config'
export const prerender = true
export function GET({ site }: { site?: URL }) {
  const origin = site || new URL(config.site.url)
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(assetPath('/sitemap.xml'), origin).toString()}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

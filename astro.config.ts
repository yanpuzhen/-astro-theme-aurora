import { defineConfig } from 'astro/config'
import type { RemarkPlugins } from 'astro'
import vue from '@astrojs/vue'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { config } from './src/lib/config'
import { remarkAurora } from './src/lib/remark-aurora'
import { rehypeBasePath } from './src/lib/rehype-base-path'
import { rehypeCodeMeta } from './src/lib/rehype-code-meta'
import { rehypeSecurity } from './src/lib/rehype-security'
import { shikiAuroraTransformer } from './src/lib/shiki-aurora'
import { localTwikooAssets, twikooAssetDirectory } from './scripts/local-twikoo-assets.mjs'

type RemarkPluginFunction = Exclude<RemarkPlugins[number], string | readonly unknown[]>

export default defineConfig({
  output: 'static',
  integrations: [vue()],
  vite: {
    plugins: [{
      name: 'aurora-local-twikoo-dev-assets',
      apply: 'serve',
      configureServer(server) {
        if (config.siteMeta.cdn !== 'cn') return
        const assets = localTwikooAssets(config.site.base)
        const assetPath = `${config.site.base}${twikooAssetDirectory}/`
        server.middlewares.use((request, response, next) => {
          const path = request.url?.split('?')[0]
          if (!path?.startsWith(assetPath)) return next()
          const name = path.slice(assetPath.length)
          const body = assets.get(name)
          if (!body) return next()
          response.setHeader('Content-Type', name.endsWith('.wasm') ? 'application/wasm' : name.endsWith('.json') ? 'application/json' : 'application/javascript')
          response.end(body)
        })
      },
    }],
  },
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, [remarkAurora as RemarkPluginFunction, { base: config.site.base }]],
    rehypePlugins: [rehypeRaw, rehypeSecurity, rehypeKatex, [rehypeBasePath, { base: config.site.base }], rehypeCodeMeta],
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-dark', transformers: [shikiAuroraTransformer] },
  },
  // Routing and config consumers share this normalized source of truth.
  site: config.site.url,
  base: config.site.base,
})

import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import { remarkAurora } from './src/lib/remark-aurora'
import { rehypeBasePath } from './src/lib/rehype-base-path'
import { rehypeCodeMeta } from './src/lib/rehype-code-meta'
import { shikiAuroraTransformer } from './src/lib/shiki-aurora'

export default defineConfig({
  output: 'static',
  integrations: [vue()],
  markdown: {
    remarkPlugins: [[remarkAurora, { base: process.env.ASTRO_BASE || '/' }]],
    rehypePlugins: [[rehypeBasePath, { base: process.env.ASTRO_BASE || '/' }], rehypeCodeMeta],
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-dark', transformers: [shikiAuroraTransformer] },
  },
  // Override both values in deployment config; components must use Astro's URL helpers.
  site: process.env.ASTRO_SITE || 'https://example.com',
  base: process.env.ASTRO_BASE || '/',
})

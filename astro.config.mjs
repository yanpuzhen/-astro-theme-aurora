import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'

export default defineConfig({
  output: 'static',
  integrations: [vue()],
  // Override both values in deployment config; components must use Astro's URL helpers.
  site: process.env.ASTRO_SITE || 'https://example.com',
  base: process.env.ASTRO_BASE || '/',
})

import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'

const config = parse(readFileSync(resolve(process.env.ASTRO_CONFIG_FILE || '_config.yml'), 'utf8'))
const mode = config?.site_meta?.cdn || 'en'
assert.ok(mode === 'en' || mode === 'cn')
const assets = readdirSync('dist/_astro')
for (const provider of ['valine', 'twikoo', 'waline']) {
  assert.ok(assets.some((name) => new RegExp(`^${provider}\\.[^.]+\\.js$`).test(name)), `${provider} local chunk missing`)
}
assert.ok(assets.some((name) => /^twikoo\.all\.min\.[^.]+\.js$/.test(name)))
assert.ok(assets.some((name) => /^twikoo\.min\.[^.]+\.js$/.test(name)))
assert.ok(assets.some((name) => /^waline\.[^.]+\.css$/.test(name)))
if (mode === 'cn') {
  assert.ok(existsSync('dist/_astro/prismjs/1.28.0/components/prism-javascript.min.js'))
}
const html = readFileSync('dist/index.html', 'utf8')
assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com)/i)
console.log(`Verified ${mode.toUpperCase()} build artifacts and no public-CDN script/style tags in generated home page.`)

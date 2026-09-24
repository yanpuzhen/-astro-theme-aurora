import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'

const config = parse(readFileSync(resolve(process.env.ASTRO_CONFIG_FILE || '_config.yml'), 'utf8'))
const mode = config?.site_meta?.cdn || 'en'
assert.ok(mode === 'en' || mode === 'cn')
const assets = readdirSync('dist/_astro')
for (const provider of ['valine', 'twikoo', 'twikoo-cloudbase', 'waline']) {
  assert.ok(assets.some((name) => new RegExp(`^${provider}\\.[^.]+\\.js$`).test(name)), `${provider} local chunk missing`)
}
assert.ok(assets.some((name) => /^waline\.[^.]+\.css$/.test(name)))
if (mode === 'cn') {
  for (const name of ['twikoo.min.js', 'twikoo.all.min.js', 'owo.json', 'cap.min.js', 'cap_wasm_bg.wasm', 'hashwx.wasm', 'pako_inflate.min.js']) {
    assert.ok(existsSync(`dist/_astro/vendor/twikoo/2.0.8/${name}`), `${name} missing`)
  }
  assert.ok(existsSync('dist/_astro/prismjs/1.28.0/components/prism-javascript.min.js'))
  for (const theme of ['prism.min.css', 'prism-okaidia.min.css', 'prism-tomorrow.min.css']) {
    assert.ok(existsSync(`dist/_astro/prismjs/1.28.0/themes/${theme}`), `${theme} missing`)
  }
} else {
  assert.ok(!existsSync('dist/_astro/prismjs/1.28.0'), 'EN build must not copy Prism runtime assets')
  assert.ok(!existsSync('dist/_astro/vendor/twikoo/2.0.8'), 'EN build must not copy Twikoo runtime assets')
}
const notices = readFileSync('dist/THIRD_PARTY_NOTICES.txt', 'utf8')
for (const name of ['valine@1.5.3', 'twikoo@2.0.8', '@waline/client@3.15.2', 'leancloud-storage@3.15.0', 'prismjs@1.28.0', '@cap.js/widget@0.1.58', '@cap.js/wasm@0.0.8', 'pako@2.1.0', '@fortawesome/fontawesome-free@7.3.1', '@twikoojs/shared@2.0.8', '@waline/api@1.1.2', 'autosize@4.0.4', 'marked@4.3.0', 'md5@2.3.0']) {
  assert.ok(notices.includes(name), `${name} distribution notice missing`)
  const line = notices.split('\n').find((line) => line.startsWith(`${name} | `))
  assert.ok(line, `${name} notice entry missing`)
  const path = line.split(' | ').at(-1).split(' ')[0]
  assert.ok(existsSync(`dist/${path}`), `${name} license absent from deployable artifact`)
}
const html = readFileSync('dist/index.html', 'utf8')
assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com)/i)
console.log(`Verified ${mode.toUpperCase()} build artifacts and no public-CDN script/style tags in generated home page.`)

import { readFileSync, existsSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const root = 'dist'
const base = '/astro-theme-aurora/demo/'
const read = (path) => readFileSync(`${root}/${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`, 'utf8')
for (const path of ['/', '/cn/', '/post/welcome-to-aurora-3/', '/cn/post/welcome-to-aurora-3-cn/', '/archives/', '/cn/archives/', '/tags/', '/cn/tags/', '/categories/', '/cn/categories/', '/search/', '/cn/search/']) {
  const value = path.replace(/^\//, '').replace(/\/$/, '')
  const candidate = value ? `${root}/${value}/index.html` : `${root}/index.html`
  assert.ok(existsSync(candidate), `Missing Demo route: ${path}`)
}
const english = read('/')
const chinese = read('/cn/')
const englishPost = read('/post/welcome-to-aurora-3/')
const chinesePost = read('/cn/post/welcome-to-aurora-3-cn/')
assert.match(english, /<html lang="en"/)
assert.match(chinese, /<html lang="zh-CN"/)
assert.match(english, /Welcome to Aurora 3\.0/)
assert.match(chinese, /欢迎使用 Aurora 3\.0/)
assert.match(chinesePost, new RegExp(`canonical" href="https://yanpuzhen.github.io${base}cn/post/welcome-to-aurora-3-cn/`))
assert.match(chinesePost, new RegExp(`hreflang="en" href="https://yanpuzhen.github.io${base}post/welcome-to-aurora-3/`))
assert.match(englishPost, new RegExp(`hreflang="zh-CN" href="https://yanpuzhen.github.io${base}cn/post/welcome-to-aurora-3-cn/`))
for (const html of [english, chinese, englishPost, chinesePost]) {
  assert.doesNotMatch(html, /(?:href|src)="\/(?!astro-theme-aurora\/)/, 'Demo contains an unbased root-relative URL')
  assert.doesNotMatch(html, /astro-theme-aurora\/demo\/astro-theme-aurora\/|\/cn\/cn\/|\/demo\/demo\/(?!aurora-cover\.svg|gallery\.svg)/)
}
const pagefindEntry = JSON.parse(readFileSync(`${root}/pagefind/pagefind-entry.json`, 'utf8'))
assert.ok(pagefindEntry.languages?.en)
assert.ok(pagefindEntry.languages?.['zh-cn'])
console.log(`Verified bilingual Demo routes under ${base}`)

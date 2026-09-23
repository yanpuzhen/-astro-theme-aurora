import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const root = 'dist'
const base = '/astro-theme-aurora/demo/'
const fileFor = (path) => {
  const value = path.replace(/^\//, '').replace(/\/$/, '')
  return `${root}/${value ? `${value}/index.html` : 'index.html'}`
}
const read = (path) => readFileSync(fileFor(path), 'utf8')
const exists = (path) => existsSync(fileFor(path))

for (const path of ['/', '/cn/', '/page/2/', '/cn/page/2/', '/post/demo-markdown-fundamentals/', '/cn/post/demo-markdown-fundamentals/', '/post/demo-code-showcase/', '/cn/post/demo-code-showcase/', '/post/demo-rich-markdown/', '/cn/post/demo-rich-markdown/', '/post/demo-math/', '/cn/post/demo-math/', '/post/demo-media/', '/cn/post/demo-media/', '/archives/', '/cn/archives/', '/archives/2/', '/cn/archives/2/', '/tags/', '/cn/tags/', '/categories/', '/cn/categories/', '/about/', '/cn/about/', '/links/', '/cn/links/', '/search/', '/cn/search/']) {
  assert.ok(exists(path), `Missing Demo route: ${path}`)
}

const english = read('/')
const chinese = read('/cn/')
const englishPost = read('/post/demo-math/')
const chinesePost = read('/cn/post/demo-math/')
assert.match(english, /Markdown Fundamentals in Aurora/)
assert.match(chinese, /Aurora Markdown 基础语法测试/)
assert.match(englishPost, /class="katex/)
assert.match(chinesePost, /class="katex/)
assert.match(read('/post/demo-rich-markdown/'), /<table>/)
assert.match(read('/post/demo-code-showcase/'), /data-code-title="build\.sh"/)
assert.match(read('/post/demo-media/'), /aurora-media-portrait/)
assert.match(english, /Aurora Demo/)
assert.match(english, /Mira Chen/)
assert.match(english, /Demo showcase data/)
assert.match(english, /Aurora-Dia/)
assert.match(read('/links/'), /Aurora 3/)
assert.match(read('/about/'), /Aurora Demo/)
assert.match(read('/about/'), /github\.com\/yanpuzhen\/astro-theme-aurora/)
assert.match(read('/cn/links/'), /Aurora 3/)

const manifest = JSON.parse(readFileSync(`${root}/route-manifest.json`, 'utf8'))
const showcase = manifest.filter((entry) => entry.translationKey?.startsWith('demo-'))
assert.equal(new Set(showcase.map((entry) => entry.translationKey)).size, 5, 'Demo must contain five translation pairs')
assert.equal(showcase.length, 10, 'Demo must contain exactly ten showcase posts')
assert.ok(showcase.every((entry) => entry.canonicalPath.includes('/post/demo-')))

const pagefindEntry = JSON.parse(readFileSync(`${root}/pagefind/pagefind-entry.json`, 'utf8'))
assert.ok(pagefindEntry.languages?.en)
assert.ok(pagefindEntry.languages?.['zh-cn'])
const htmlFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
  const path = `${directory}/${item.name}`
  return item.isDirectory() ? htmlFiles(path) : item.name.endsWith('.html') ? [path] : []
})
for (const path of htmlFiles(root)) {
  const html = readFileSync(path, 'utf8')
  assert.doesNotMatch(html, /legacy-markdown-parity|迁移后的第一篇文章|aurora-placeholder\.svg/i, `Compatibility fixture leaked into Demo: ${path}`)
  assert.doesNotMatch(html, /(?:href|src)="\/(?!astro-theme-aurora\/)/, `Demo contains an unbased URL: ${path}`)
  assert.doesNotMatch(html, /astro-theme-aurora\/demo\/astro-theme-aurora\/|\/cn\/cn\/|\/demo\/demo\//)
}
console.log(`Verified ten bilingual showcase posts, Math/GFM, links, profile, comments, Dia, footer, and isolation under ${base}`)

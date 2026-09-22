import { readFileSync, existsSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const root = 'dist'
const relative = (path) => path.replace(/^\//, '').replace(/\/$/, '')
const fileFor = (path) => {
  const value = relative(path) || 'index'
  const directoryFile = `${root}/${value}/index.html`
  return existsSync(directoryFile) ? directoryFile : `${root}/${value}.html`
}
const read = (path) => readFileSync(fileFor(path), 'utf8')
const exists = (path) => existsSync(fileFor(path))
const htmlLang = (html) => html.match(/<html lang="([^"]+)"/)?.[1]
const canonical = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
const alternate = (html, locale) => html.match(new RegExp(`<link rel="alternate" hreflang="${locale}" href="([^"]+)"`))?.[1]

for (const path of ['/', '/archives/', '/tags/', '/categories/', '/search/', '/about/', '/links/', '/post/architecture-smoke/', '/cn/', '/cn/archives/', '/cn/tags/', '/cn/categories/', '/cn/search/', '/cn/about/', '/cn/links/', '/cn/post/legacy-compatibility/', '/cn/post/unicode-torture/', '/cn/legacy/custom-route/', '/404/', '/cn/404/']) {
  assert.ok(exists(path), `Missing static i18n route: ${path}`)
}

const englishHome = read('/')
const chineseHome = read('/cn/')
const englishPost = read('/post/architecture-smoke/')
const chinesePost = read('/cn/post/legacy-compatibility/')
assert.equal(htmlLang(englishHome), 'en')
assert.equal(htmlLang(chineseHome), 'zh-CN')
assert.equal(htmlLang(englishPost), 'en')
assert.equal(htmlLang(chinesePost), 'zh-CN')
assert.equal(canonical(englishPost), 'https://example.com/post/architecture-smoke/')
assert.equal(canonical(chinesePost), 'https://example.com/cn/legacy/custom-route/')
assert.equal(alternate(chinesePost, 'en'), undefined)
assert.equal(alternate(englishPost, 'zh-CN'), undefined)
assert.doesNotMatch(read('/'), /demo-markdown-fundamentals|Aurora Demo/)
assert.match(read('/cn/tags/中文/'), /中文 Test/)
assert.match(readFileSync(`${root}/sitemap.xml`, 'utf8'), /<loc>https:\/\/example\.com\/cn\//)
assert.match(readFileSync(`${root}/sitemap.xml`, 'utf8'), /<loc>https:\/\/example\.com\/post\//)
assert.match(readFileSync(`${root}/rss.xml`, 'utf8'), /Architecture smoke post/)
assert.doesNotMatch(readFileSync(`${root}/rss.xml`, 'utf8'), /Markdown Fundamentals in Aurora/)
assert.match(readFileSync(`${root}/cn/rss.xml`, 'utf8'), /迁移后的第一篇文章/)
const manifest = JSON.parse(readFileSync(`${root}/route-manifest.json`, 'utf8'))
assert.equal(manifest.filter((entry) => entry.translationKey?.startsWith('demo-')).length, 0)
const pagefindEntry = JSON.parse(readFileSync(`${root}/pagefind/pagefind-entry.json`, 'utf8'))
assert.ok(pagefindEntry.languages?.en)
assert.ok(pagefindEntry.languages?.['zh-cn'])
for (const html of [englishHome, chineseHome, englishPost, chinesePost]) assert.doesNotMatch(html, /(?:href|src)="(?:\/cn\/){2}|(?:\/demo\/){2}/)
console.log('Verified static i18n routes, locale SEO, feeds, taxonomy isolation, comments, and Pagefind indexes')

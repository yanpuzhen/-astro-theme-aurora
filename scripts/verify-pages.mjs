import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import { resolve } from 'node:path'

const root = resolve(new URL('../.pages-dist/', import.meta.url).pathname)
const docsBase = '/astro-theme-aurora/'
const demoBase = '/astro-theme-aurora/demo/'
const read = (relative) => readFileSync(resolve(root, relative), 'utf8')
const requiredFiles = [
  'index.html', 'en/index.html', 'cn/index.html', 'guide/getting-started.html', 'cn/guide/getting-started.html',
  'demo/index.html', 'demo/pagefind/pagefind.js', 'demo/pagefind/pagefind-entry.json',
  'demo/post/demo-markdown-fundamentals/index.html',
  'demo/post/demo-math/index.html',
  'demo/cn/post/demo-markdown-fundamentals/index.html',
  'demo/page/2/index.html', 'demo/cn/page/2/index.html',
]

for (const relative of requiredFiles) {
  assert.ok(existsSync(resolve(root, relative)) && statSync(resolve(root, relative)).isFile(), `Missing Pages artifact: ${relative}`)
}

const docs = read('index.html')
const docsEnglish = read('en/index.html')
const docsChinese = read('cn/index.html')
const demo = read('demo/index.html')
const demoSearch = read('demo/search/index.html')
const demoPost = read('demo/post/demo-markdown-fundamentals/index.html')
const entry = JSON.parse(read('demo/pagefind/pagefind-entry.json'))

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const path = resolve(directory, item.name)
    return item.isDirectory() ? htmlFiles(path) : item.name.endsWith('.html') ? [path] : []
  })
}

assert.match(docs, /Aurora 3\.0/)
assert.match(docsEnglish, /Aurora 3\.0 documentation moved/)
assert.match(docsChinese, /使用文档|Aurora 3\.0/)
assert.match(docsEnglish, /\/astro-theme-aurora\/\"?\/?<\/a>/)
assert.match(docs, /https:\/\/yanpuzhen\.github\.io\/astro-theme-aurora\/demo\//)
assert.match(demo, /Markdown Fundamentals in Aurora/)
assert.match(demoSearch, /SearchIsland/)
assert.match(demoSearch, new RegExp(demoBase.replaceAll('/', '\\/')))
assert.match(demoPost, /AuroraSearchAlpha|CommonMark/)
assert.doesNotMatch(`${demo}${demoSearch}`, /legacy-markdown-parity|migration torture|security payload/i)
assert.doesNotMatch(`${demo}${demoSearch}`, /\/fixtures\//i)
assert.ok(entry.languages?.en, 'Demo Pagefind English index is missing')
assert.ok(entry.languages?.['zh-cn'], 'Demo Pagefind Chinese index is missing')

for (const html of [docs, docsEnglish, docsChinese]) {
  assert.ok(html.includes(docsBase), 'Documentation HTML does not contain the configured Pages base')
}
for (const html of [demo, demoPost]) {
  assert.ok(html.includes(demoBase), 'Demo HTML does not contain the configured nested base')
  assert.doesNotMatch(html, /(?:src|href)="[^" ]+\.(?:svg|png|jpe?g|webp|css|js|woff2)\//i, 'Demo static file URLs must not receive a route trailing slash')
  assert.doesNotMatch(html, /(?:href|src)="\/(?!astro-theme-aurora\/|\/\/)/, 'Found an unbased root-relative asset/link')
}
for (const path of htmlFiles(root)) {
  const html = readFileSync(path, 'utf8')
  assert.doesNotMatch(html, /(?:href|src)="\/(?!astro-theme-aurora\/|\/|#)/, `Found an unbased Pages URL in ${path}`)
}

console.log(`Verified Pages artifact: docs ${docsBase}, Demo ${demoBase}`)

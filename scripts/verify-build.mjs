import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import { createHash } from 'node:crypto'

const base = process.env.ASTRO_BASE || '/'
const root = 'dist'
const withBase = (path) => `${base.replace(/\/$/, '')}${path}`.replace(/^$/, '/')
const withoutBase = (path) => {
  if (base === '/') return path
  const prefix = base.replace(/\/$/, '')
  return path.startsWith(prefix) ? path.slice(prefix.length) || '/' : path
}
const fileFor = (path) => {
  const relative = withoutBase(path).replace(/^\//, '').replace(/\/$/, '')
  return `${root}/${relative ? `${relative}/index.html` : 'index.html'}`
}
const read = (path) => readFileSync(fileFor(path), 'utf8')
const post = read(withBase('/post/architecture-smoke/'))
const rich = read(withBase('/post/legacy-markdown-parity/'))
const unicode = read(withBase('/cn/post/unicode-torture/'))
const custom = read(withBase('/cn/legacy/custom-route/'))
const about = read(withBase('/about/'))
const listFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = `${directory}/${entry.name}`
  return entry.isDirectory() ? listFiles(path) : [path]
})
const generatedText = listFiles(root)
  .filter((path) => /\.(?:html|js|json|xml|txt)$/i.test(path))
  .map((path) => [path, readFileSync(path, 'utf8')])
const demoOnly = /Aurora Demo|Mira Chen|aurora-demo-(?:avatar|comment|link)|demo-(?:markdown-fundamentals|code-showcase|rich-markdown|math|media)|yanpuzhen\.github\.io\/astro-theme-aurora|github\.com\/yanpuzhen\/astro-theme-aurora/i
for (const [path, text] of generatedText) assert.doesNotMatch(text, demoOnly, `Demo-only identity/data leaked into ordinary build: ${path}`)

assert.match(post, /This fixture proves that the post body is rendered at build time\./)
assert.match(post, /<link rel="canonical" href="https:\/\/example\.com\//)
assert.doesNotMatch(post, /(?:src|href)="[^" ]+\.(?:svg|png|jpe?g|webp|css|js|woff2)\//i, 'static file URLs must not receive a route trailing slash')
assert.match(rich, /Static HTML/)
assert.match(rich, /legacy-markdown-parity/)
assert.ok(rich.includes(`src="${withBase('/fixtures/aurora-placeholder.svg')}"`), 'raw HTML image assets must include the configured base path')
assert.match(rich, /data-code-title="example\.ts"/)
assert.match(rich, /data-highlight-lines="1"/)
assert.doesNotMatch(rich, /alert\('this must not execute'\)/)
assert.doesNotMatch(rich, /(?:javascript:|\bonclick\s*=|<iframe\b)/i, 'raw Markdown must not retain executable URLs, handlers, or iframe elements')
assert.match(custom, /迁移后的第一篇文章/)
assert.ok(custom.includes(`src="${withBase('/fixtures/aurora-placeholder.svg')}"`), 'cover assets must include the configured base path')
assert.match(unicode, /中文 Test 🚀 café 日本語/)
assert.ok(unicode.includes(`src="${withBase('/fixtures/aurora-placeholder.svg')}"`), 'Unicode fixture assets must include the configured base path')
assert.match(unicode, /content="C\+\+"/)
assert.match(unicode, /content="C#"/)
const jsonLdText = unicode.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
assert.ok(jsonLdText, 'Unicode fixture must contain JSON-LD')
assert.equal(JSON.parse(jsonLdText).description, 'Metadata with </script>, quotes "and" emoji 🚀 plus HTML-like text.')

const manifestPath = `${root}/route-manifest.json`
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const legacy = manifest.find((entry) => entry.legacyUid === 'legacy-fixture-uid-001')
assert.equal(legacy.canonicalPath, '/cn/legacy/custom-route/')
assert.ok(legacy.aliases.includes('/cn/post/legacy-compatibility.html'))
assert.equal(legacy.commentPath, '/post/legacy-compatibility/')
assert.ok(manifest.some((entry) => entry.canonicalPath === '/post/architecture-smoke/'))
assert.ok(read(withBase('/cn/tags/中文/')).includes('中文'))
assert.ok(read(withBase('/categories/engineering/frontend/')).includes('Legacy Markdown parity'))
assert.ok(read(withBase('/cn/tags/c-plus-plus/')).includes('C++'))
assert.ok(read(withBase('/cn/tags/c-sharp/')).includes('C#'))
assert.ok(read(withBase('/archives/')).includes('Legacy Markdown parity'))
assert.match(about, /About Aurora 3/)
assert.doesNotMatch(about, /Source repository|Documentation|Aurora Demo/)
const expectedSmokeUid = createHash('md5').update('post_uid___Architecture smoke post').digest('hex')
assert.equal(manifest.find((entry) => entry.id === 'architecture-smoke').legacyUid, expectedSmokeUid)
assert.equal(existsSync(`${root}/pagefind/pagefind.js`), true)
const pagefindEntry = JSON.parse(readFileSync(`${root}/pagefind/pagefind-entry.json`, 'utf8'))
assert.ok(pagefindEntry.languages['zh-cn'] || pagefindEntry.languages.en)
assert.equal(existsSync(`${root}/rss.xml`), true)
assert.equal(existsSync(`${root}/sitemap.xml`), true)
assert.equal(existsSync(`${root}/robots.txt`), true)
assert.equal(existsSync(`${root}/favicon.svg`), true)
assert.equal(existsSync(`${root}/api/search.json`), false)
assert.doesNotMatch(readFileSync(`${root}/sitemap.xml`, 'utf8'), /unicode-torture|architecture-smoke|legacy-compatibility|legacy-rich-markdown/)
assert.match(readFileSync(`${root}/rss.xml`, 'utf8'), /<language>en-US<\/language>/)
assert.match(readFileSync(`${root}/cn/rss.xml`, 'utf8'), /<language>zh-CN<\/language>/)
assert.match(read(withBase('/about/')), new RegExp(`href="${withBase('/rss.xml')}"`), 'English RSS alternate must target the actual feed file')
assert.match(read(withBase('/about/')), new RegExp(`href="${withBase('/cn/rss.xml')}"`), 'Chinese RSS alternate must target the actual feed file')
if (base !== '/') {
  assert.match(post, new RegExp(`href="${base}`))
  assert.doesNotMatch(post, /href="\/post\/architecture-smoke\//)
}
console.log(`Verified ${manifest.length} route manifest entries with base ${base}`)

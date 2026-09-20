import { existsSync, readFileSync } from 'node:fs'
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
const unicode = read(withBase('/post/unicode-torture/'))
const custom = read(withBase('/legacy/custom-route/'))

assert.match(post, /This fixture proves that the post body is rendered at build time\./)
assert.match(post, /<link rel="canonical" href="https:\/\/example\.com\//)
assert.doesNotMatch(post, /(?:src|href)="[^" ]+\.(?:svg|png|jpe?g|webp|css|js|woff2)\//i, 'static file URLs must not receive a route trailing slash')
assert.match(rich, /Static HTML/)
assert.match(rich, /legacy-markdown-parity/)
assert.ok(rich.includes(`src="${withBase('/fixtures/aurora-placeholder.svg')}"`), 'raw HTML image assets must include the configured base path')
assert.match(rich, /data-code-title="example\.ts"/)
assert.match(rich, /data-highlight-lines="1"/)
assert.doesNotMatch(rich, /alert\('this must not execute'\)/)
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
assert.equal(legacy.canonicalPath, '/legacy/custom-route/')
assert.ok(legacy.aliases.includes('/post/legacy-compatibility.html'))
assert.equal(legacy.commentPath, '/post/legacy-compatibility/')
assert.ok(manifest.some((entry) => entry.canonicalPath === '/post/architecture-smoke/'))
assert.ok(read(withBase('/tags/中文/')).includes('中文'))
assert.ok(read(withBase('/categories/engineering/frontend/')).includes('Legacy Markdown parity'))
assert.ok(read(withBase('/tags/c-plus-plus/')).includes('C++'))
assert.ok(read(withBase('/tags/c-sharp/')).includes('C#'))
assert.ok(read(withBase('/archives/')).includes('Legacy Markdown parity'))
assert.ok(read(withBase('/about/')).includes('Aurora 3.0'))
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
assert.match(readFileSync(`${root}/sitemap.xml`, 'utf8'), /unicode-torture/)
assert.match(readFileSync(`${root}/rss.xml`, 'utf8'), /中文 Test 🚀 café 日本語/)
if (base !== '/') {
  assert.match(post, new RegExp(`href="${base}`))
  assert.doesNotMatch(post, /href="\/post\/architecture-smoke\//)
}
console.log(`Verified ${manifest.length} route manifest entries with base ${base}`)

import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import { SyntaxValidator } from 'fast-xml-validator'

const origin = process.env.ASTRO_SITE || 'https://example.com'
const configuredBase = process.env.ASTRO_BASE || '/'
const mode = process.env.FEED_EXPECT_MODE || 'ordinary'
assert.ok(['ordinary', 'demo'].includes(mode), `Unknown FEED_EXPECT_MODE: ${mode}`)
const base = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`
const expectedRoot = `${origin.replace(/\/$/, '')}${base}`
const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true })
const read = (file) => readFileSync(file, 'utf8')
const parseXml = (file) => {
  assert.ok(existsSync(file), `Expected generated feed artifact ${file}`)
  const xml = read(file)
  try {
    SyntaxValidator.validate(xml)
  } catch (error) {
    assert.fail(`Malformed XML in ${file}: ${error instanceof Error ? error.message : String(error)}`)
  }
  return parser.parse(xml)
}
const asList = (value) => value === undefined ? [] : Array.isArray(value) ? value : [value]

const english = parseXml('dist/rss.xml').rss
const chinese = parseXml('dist/cn/rss.xml').rss
assert.ok(english && chinese, 'Both feeds must be RSS documents')
assert.equal(english.channel.language, 'en-US')
assert.equal(chinese.channel.language, 'zh-CN')
const englishItems = asList(english.channel.item)
const chineseItems = asList(chinese.channel.item)
if (mode === 'ordinary') {
  assert.equal(englishItems.length, 0, 'Repository-only English fixtures must opt out of the ordinary user feed')
  assert.equal(chineseItems.length, 0, 'Repository-only Chinese fixtures must opt out of the ordinary user feed')
} else {
  assert.ok(englishItems.length > 0, 'Demo English feed must contain public Demo entries')
  assert.ok(chineseItems.length > 0, 'Demo Chinese feed must contain public Demo entries')
  assert.ok(englishItems.some((item) => /demo-markdown-fundamentals/.test(item.link)), 'Demo English feed is missing a representative Demo post')
  assert.ok(chineseItems.some((item) => /demo-markdown-fundamentals/.test(item.link)), 'Demo Chinese feed is missing a representative translated Demo post')
}
for (const item of englishItems) {
  assert.match(item.link, /^https?:\/\//, 'RSS post links must be absolute')
  assert.ok(item.link.startsWith(`${expectedRoot}/`), `Unexpected English feed base: ${item.link}`)
  assert.doesNotMatch(item.link, /\/cn\//, 'English feed must not contain Chinese routes')
  assert.equal(item.guid['@_isPermaLink'], 'true')
  assert.ok(item.pubDate)
  assert.ok(!/<(?:script|iframe)\b/i.test(item.description || ''), 'Descriptions must be plain text, not unsafe HTML')
}
for (const item of chineseItems) {
  assert.match(item.link, /^https?:\/\//, 'RSS post links must be absolute')
  assert.ok(item.link.startsWith(`${expectedRoot}/cn/`), `Unexpected Chinese feed base: ${item.link}`)
  assert.equal(item.guid['@_isPermaLink'], 'true')
  assert.ok(item.pubDate)
}

const sitemapDoc = parseXml('dist/sitemap.xml')
const sitemapUrls = asList(sitemapDoc.urlset.url).map((entry) => entry.loc)
assert.ok(sitemapUrls.length > 0, 'Sitemap should contain canonical public pages')
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap URLs must be unique')
for (const url of sitemapUrls) {
  assert.ok(url.startsWith(expectedRoot), `Sitemap URL has a missing or duplicate base: ${url}`)
  assert.doesNotMatch(url, /\.html(?:$|[?#])/i, 'Legacy .html aliases should not be canonical sitemap entries')
  assert.doesNotMatch(url, /architecture-smoke|legacy-compatibility|legacy-rich-markdown|unicode-torture/i, 'Internal fixture content leaked into this sitemap')
  if (mode === 'ordinary') assert.doesNotMatch(url, /demo-/i, 'Demo content leaked into the ordinary sitemap')
  else assert.doesNotMatch(url, /architecture-smoke|legacy-compatibility|legacy-rich-markdown|unicode-torture/i)
}
const robots = read('dist/robots.txt')
assert.match(robots, /^User-agent: \*\nAllow: \/\nSitemap: /)
assert.ok(robots.includes(`${expectedRoot}/sitemap.xml`), `robots.txt points to the wrong sitemap: ${robots}`)
assert.doesNotMatch(robots, /-astro-theme-aurora/i)

console.log(`Verified ${mode} EN RSS (${englishItems.length} items), ZH-CN RSS (${chineseItems.length} items), canonical sitemap (${sitemapUrls.length} URLs), and robots.txt under ${configuredBase}.`)

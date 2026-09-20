import { existsSync, readdirSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import { join, relative, resolve } from 'node:path'

const root = resolve(new URL('../docs-site', import.meta.url).pathname)
const english = resolve(root, 'en')
const chinese = resolve(root, 'cn')
const intentionalEnglishOnly = new Set(['index.md'])

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : []
  })
}

const englishPages = markdownFiles(english).map((path) => relative(english, path)).sort()
const chinesePages = new Set(markdownFiles(chinese).map((path) => relative(chinese, path)))
for (const page of englishPages) {
  if (intentionalEnglishOnly.has(page)) continue
  assert.ok(chinesePages.has(page), `Missing Chinese Docs counterpart: ${page}`)
}
for (const page of chinesePages) {
  assert.ok(englishPages.includes(page), `Missing English Docs counterpart: ${page}`)
}

for (const page of ['guide/getting-started.md', 'guide/internationalization.md', 'configs/general.md', 'upgrade/from-aurora-2.md']) {
  assert.ok(englishPages.includes(page), `Missing English core Docs page: ${page}`)
  assert.ok(chinesePages.has(page), `Missing Chinese core Docs page: ${page}`)
}

const config = resolve(root, '.vitepress/config.mts')
assert.ok(existsSync(config), 'VitePress configuration is missing')
console.log(`Verified bilingual Docs parity: ${englishPages.length} English and ${chinesePages.size} Chinese Markdown pages`)

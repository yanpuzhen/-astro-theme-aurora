import { existsSync, readFileSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const readme = readFileSync(resolve(root, 'README.md'), 'utf8')
const expectedLinks = [
  'https://yanpuzhen.github.io/-astro-theme-aurora/',
  'https://yanpuzhen.github.io/-astro-theme-aurora/demo/',
  'https://yanpuzhen.github.io/-astro-theme-aurora/cn/',
  'https://github.com/yanpuzhen/-astro-theme-aurora',
  './CHANGELOG.md',
]
for (const link of expectedLinks) assert.ok(readme.includes(link), `README link missing: ${link}`)
for (const preview of ['home-page.png', 'article-section.png', 'article-detail.png', 'mobile.png']) {
  assert.ok(existsSync(resolve(root, 'previews', preview)), `README preview missing: ${preview}`)
}
assert.doesNotMatch(readme, /npm (downloads|version)|npmjs\.com/i, 'README contains an obsolete npm claim')
assert.doesNotMatch(readme, /Buy Me A Coffee|爱发电|909955326|joinchat/i, 'README presents upstream donation/community identity as current')
console.log('Verified README links, preview assets, and current-project claims')

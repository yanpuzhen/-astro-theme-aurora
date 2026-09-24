import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { parse } from 'yaml'
import { localTwikooAssets, twikooAssetDirectory } from './local-twikoo-assets.mjs'

const root = resolve(import.meta.dirname, '..')
const input = parse(readFileSync(resolve(root, process.env.ASTRO_CONFIG_FILE || '_config.yml'), 'utf8')) || {}
const cdn = input.site_meta?.cdn || 'en'
const base = process.env.ASTRO_BASE || input.site?.base || '/'
const dist = resolve(root, 'dist')

function copy(source, target) {
  const destination = resolve(dist, target)
  mkdirSync(dirname(destination), { recursive: true })
  copyFileSync(resolve(root, source), destination)
}

if (cdn === 'cn') {
  for (const [name, body] of localTwikooAssets(base)) {
    const destination = resolve(dist, twikooAssetDirectory, name)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, body)
  }
}

const packages = [
  ['valine', '1.5.3', 'LICENSE'],
  ['twikoo', '2.0.8', 'LICENSE'],
  ['@waline/client', '3.15.2', 'LICENSE'],
  ['leancloud-storage', '3.15.0', 'LICENSE'],
  ['prismjs', '1.28.0', 'LICENSE'],
  ['@cap.js/widget', '0.1.58', 'LICENSE'],
  ['pako', '2.1.0', 'LICENSE'],
  ['@fortawesome/fontawesome-free', '7.3.1', 'LICENSE.txt'],
]
const lines = [
  'Aurora 3.0.0 third-party distribution notices',
  '===========================================',
  '',
  'The files under _licenses are copied verbatim from installed npm packages.',
  'Twikoo bundles Font Awesome Free SVG-derived icon material. The pinned 7.3.1',
  'package supplies its license text here; Twikoo\'s embedded icon source version is not asserted.',
  '@cap.js/widget is distributed only by CN builds, but its notice is included in both modes.',
  '',
]
for (const [name, version, filename] of packages) {
  const packagePath = resolve(root, 'node_modules', name, 'package.json')
  const metadata = JSON.parse(readFileSync(packagePath, 'utf8'))
  if (metadata.version !== version) throw new Error(`Unexpected ${name} version ${metadata.version}`)
  const licensePath = resolve(root, 'node_modules', name, filename)
  if (!existsSync(licensePath)) throw new Error(`Missing installed license: ${licensePath}`)
  const target = `_licenses/${name.replaceAll('/', '__')}@${version}/${filename}`
  copy(`node_modules/${name}/${filename}`, target)
  lines.push(`${name}@${version} | ${metadata.license || 'see license file'} | ${target}`)
}
const wasm = JSON.parse(readFileSync(resolve(root, 'node_modules/@cap.js/wasm/package.json'), 'utf8'))
if (wasm.version !== '0.0.8' || wasm.license !== 'Apache-2.0') throw new Error('Unexpected @cap.js/wasm license metadata')
copy('node_modules/@cap.js/widget/LICENSE', '_licenses/@cap.js__wasm@0.0.8/LICENSE')
lines.push('@cap.js/wasm@0.0.8 | Apache-2.0 | _licenses/@cap.js__wasm@0.0.8/LICENSE (license text from the same Cap upstream project)')
writeFileSync(resolve(dist, 'THIRD_PARTY_NOTICES.txt'), `${lines.join('\n')}\n`)

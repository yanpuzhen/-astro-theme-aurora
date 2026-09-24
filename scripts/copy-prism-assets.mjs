import { cpSync, mkdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'

// Twikoo resolves language components and theme stylesheets under prismCdn.
// Its supported highlight plugins are bundled in the Twikoo client.
let cdn = 'en'
try { cdn = parse(readFileSync(resolve(process.env.ASTRO_CONFIG_FILE || '_config.yml'), 'utf8'))?.site_meta?.cdn || 'en' }
catch (error) { if (error?.code !== 'ENOENT') throw error }
if (cdn === 'cn') {
  const source = resolve('node_modules/prismjs')
  const target = resolve('dist/_astro/prismjs/1.28.0')
  mkdirSync(target, { recursive: true })
  for (const directory of ['components', 'themes']) {
    cpSync(resolve(source, directory), resolve(target, directory), { recursive: true })
  }
}

import { cpSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parse } from 'yaml'

// Twikoo's optional syntax highlighter resolves Prism languages by filename.
// Copy the exact official package version into the static build for CN mode.
let cdn = 'en'
try { cdn = parse(readFileSync(resolve(process.env.ASTRO_CONFIG_FILE || '_config.yml'), 'utf8'))?.site_meta?.cdn || 'en' }
catch (error) { if (error?.code !== 'ENOENT') throw error }
if (cdn === 'cn') {
  const target = resolve('dist/_astro/prismjs/1.28.0/components')
  mkdirSync(dirname(target), { recursive: true })
  cpSync(resolve('node_modules/prismjs/components'), target, { recursive: true })
}

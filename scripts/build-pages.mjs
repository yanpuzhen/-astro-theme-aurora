import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const staging = resolve(root, '.pages-dist')
const pnpm = process.env.PNPM_HOME ? resolve(process.env.PNPM_HOME, 'pnpm') : 'pnpm'

function run(script) {
  execFileSync(pnpm, ['run', script], { cwd: root, stdio: 'inherit', env: process.env })
}

rmSync(staging, { recursive: true, force: true })
run('docs:build')
run('demo:build')

const docsDist = resolve(root, 'docs-site/.vitepress/dist')
const demoDist = resolve(root, 'dist')
if (!existsSync(docsDist) || !existsSync(demoDist)) {
  throw new Error('Docs or Demo build output is missing; refusing to create a partial Pages artifact.')
}

mkdirSync(staging, { recursive: true })
cpSync(docsDist, staging, { recursive: true })
mkdirSync(resolve(staging, 'demo'), { recursive: true })
cpSync(demoDist, resolve(staging, 'demo'), { recursive: true })

console.log(`Staged documentation and Demo in ${staging}`)

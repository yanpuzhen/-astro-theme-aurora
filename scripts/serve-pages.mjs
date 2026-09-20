import { createReadStream } from 'node:fs'
import { existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../.pages-dist/', import.meta.url)))
const base = '/-astro-theme-aurora'
const portIndex = process.argv.indexOf('--port')
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : 4321)
const contentTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
}

function targetFor(requestPath) {
  if (requestPath !== base && !requestPath.startsWith(`${base}/`)) return undefined
  const relative = requestPath.slice(base.length) || '/'
  const decoded = decodeURIComponent(relative)
  const files = decoded === '/'
    ? ['index.html']
    : decoded.endsWith('/')
      ? [`${decoded.slice(1)}index.html`]
      : [decoded.slice(1), `${decoded.slice(1)}.html`, `${decoded.slice(1)}/index.html`]
  for (const file of files) {
    const target = normalize(join(root, file))
    if (target !== root && !target.startsWith(`${root}/`)) continue
    if (existsSync(target) && statSync(target).isFile()) return target
  }
  return undefined
}

createServer((request, response) => {
  const requestPath = new URL(request.url || '/', 'http://127.0.0.1').pathname
  const target = targetFor(requestPath)
  if (!target || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'content-type': contentTypes[extname(target)] || 'application/octet-stream' })
  if (request.method === 'HEAD') response.end()
  else createReadStream(target).pipe(response)
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://127.0.0.1:${port}${base}/`))

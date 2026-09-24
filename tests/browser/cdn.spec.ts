import { expect, test } from '@playwright/test'

const base = (process.env.PLAYWRIGHT_BASE_PATH || '').replace(/\/$/, '')
const forbidden = /(?:unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/i

test('CN provider static clients are same-origin and lazy', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.route(/https:\/\/(?:twikoo|waline)\.example\/.*/, (route) => {
    const request = route.request()
    const recentTwikoo = request.postDataJSON()?.event === 'GET_RECENT_COMMENTS'
    const recentWaline = request.url().includes('type=recent')
    const rows = recentTwikoo
      ? [{ id: 'tw-cn', nick: 'Twikoo CN Reader', commentText: 'Local recent comment', url: '/post/preflight/' }]
      : recentWaline
        ? [{ id: 'wa-cn', nick: 'Waline CN Reader', comment: 'Local recent comment', url: '/post/preflight/' }]
        : []
    const body = recentWaline ? rows : { code: 0, data: rows, comments: rows }
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) })
  })
  await page.route('https://giscus.app/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>giscus mock</title>' }))
  await page.goto(`${base}/`)
  expect(requests.filter((url) => /(?:valine|twikoo|waline)/i.test(url))).toEqual([])
  await page.goto(`${base}/preflight/comments/`)
  await expect.poll(() => requests.some((url) => /\/valine\.[^/]+\.js/.test(url))).toBe(true)
  await expect.poll(() => requests.some((url) => /\/twikoo\.min\.[^/]+\.js/.test(url))).toBe(true)
  await expect.poll(() => requests.some((url) => /\/twikoo\.all\.min\.[^/]+\.js/.test(url))).toBe(true)
  await expect.poll(() => requests.some((url) => /\/waline\.[^/]+\.js/.test(url))).toBe(true)
  await expect.poll(() => requests.some((url) => /\/waline\.[^/]+\.css/.test(url))).toBe(true)
  await expect(page.locator('section[aria-label="Twikoo recent comments"]')).toContainText('Twikoo CN Reader')
  await expect(page.locator('section[aria-label="Waline recent comments"]')).toContainText('Waline CN Reader')
  const runtimeAssets = requests.filter((url) => /(?:valine|twikoo|waline)[^/]*\.(?:js|css)(?:\?|$)/i.test(url))
  expect(runtimeAssets.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true)
  expect(requests.filter((url) => forbidden.test(url))).toEqual([])
  const apiShapes = await page.evaluate(async () => {
    const files = performance.getEntriesByType('resource').map((entry) => entry.name)
    const moduleFor = async (name: string) => import(/* @vite-ignore */ files.find((url) => new RegExp(`/${name}\\.[^/]+\\.js$`).test(url))!)
    const [valine, waline] = await Promise.all([moduleFor('valine'), moduleFor('waline')])
    const twikoo = (window as any).twikoo
    return {
      valine: typeof valine.default,
      twikooInit: typeof twikoo?.init,
      twikooRecent: typeof twikoo?.getRecentComments,
      walineInit: typeof waline.init,
      walineRecent: typeof waline.RecentComments,
    }
  })
  expect(apiShapes).toEqual({
    valine: 'function', twikooInit: 'function', twikooRecent: 'function',
    walineInit: 'function', walineRecent: 'function',
  })
  requests.length = 0
  await page.goto(`${base}/preflight/cloudbase/`)
  await expect.poll(() => requests.some((url) => /\/twikoo\.all\.min\.[^/]+\.js$/.test(url))).toBe(true)
  expect(requests.some((url) => /\/twikoo\.min\.[^/]+\.js$/.test(url))).toBe(false)
  expect(requests.filter((url) => forbidden.test(url))).toEqual([])
})

test('CN Twikoo delayed Prism component and theme use the configured base', async ({ page }) => {
  const responses = new Map<string, { status: number; contentType: string; body: string }>()
  const requests: string[] = []
  const pageErrors: string[] = []
  const component = `${base}/_astro/prismjs/1.28.0/components/prism-python.min.js`
  const theme = `${base}/_astro/prismjs/1.28.0/themes/prism-okaidia.min.css`
  page.on('request', (request) => requests.push(request.url()))
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', async (response) => {
    const pathname = new URL(response.url()).pathname
    if (pathname === component || pathname === theme) {
      responses.set(pathname, {
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        body: await response.text(),
      })
    }
  })
  await page.route('https://twikoo.example/**', (route) => {
    const event = route.request().postDataJSON()?.event
    const payload = event === 'GET_CONFIG'
      ? { code: 0, config: { HIGHLIGHT: 'true', HIGHLIGHT_THEME: 'okaidia', HIGHLIGHT_PLUGIN: 'none' } }
      : event === 'COMMENT_GET'
        ? { code: 0, data: [{ _id: 'python-comment', nick: 'Tester', comment: '<pre><code class="language-python">print(123)</code></pre>', created: Date.now(), replies: [], likes: [], dislikes: [], url: '/post/preflight/' }], count: 1, more: false }
        : { code: 0, data: [] }
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(payload) })
  })
  await page.goto(`${base}/preflight/twikoo-highlight/`)
  await expect(page.locator('[data-provider-test="twikoo"] code.language-python')).toContainText('print(123)')
  await expect.poll(() => responses.has(component)).toBe(true)
  await expect.poll(() => responses.has(theme)).toBe(true)
  expect(responses.get(component)?.status).toBe(200)
  expect(responses.get(theme)?.status).toBe(200)
  expect(responses.get(theme)?.contentType).toContain('text/css')
  expect(responses.get(theme)?.body).toMatch(/\.token|\.language-python/)
  expect([component, theme].every((path) => requests.includes(new URL(path, page.url()).href))).toBe(true)
  expect(requests.filter((url) => /prismjs/i.test(url)).every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true)
  expect(requests.filter((url) => /\/_astro\/(?:valine|waline)[^/]*\.(?:js|css)$/.test(url))).toEqual([])
  expect(requests.filter((url) => forbidden.test(url))).toEqual([])
  expect(pageErrors).toEqual([])
})

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

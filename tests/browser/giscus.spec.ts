import { test, expect } from '@playwright/test'

const base = (process.env.PLAYWRIGHT_BASE_PATH || '').replace(/\/$/, '')
const route = (path: string) => `${base}${path}`

test.beforeEach(async ({ page }) => {
  // A deterministic iframe response prevents any GitHub read or write during tests.
  await page.route('https://giscus.app/**', (request) => request.fulfill({
    status: 200, contentType: 'text/html',
    body: '<!doctype html><html><body><script>parent.postMessage({giscus:{resizeHeight:120}},new URL(location.href).searchParams.get("origin"))</script>Local giscus fixture</body></html>',
  }))
})

test('configured giscus reaches an English article under a deployment base', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(route('/post/architecture-smoke/'))
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible()
  await expect(page.locator('section.comments')).toHaveAttribute('data-provider', 'giscus')
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  const widget = page.locator('section.comments giscus-widget')
  await expect(widget).toHaveCount(1)
  await expect(widget).toHaveAttribute('repo', 'example/comments')
  await expect(widget).toHaveAttribute('repoid', 'R_test')
  await expect(widget).toHaveAttribute('mapping', 'pathname')
  await expect(widget).toHaveAttribute('lang', 'en')
  await page.locator('html').evaluate((element) => { element.dataset.theme = 'light' })
  await expect(widget).toHaveAttribute('theme', 'light')
  await expect(page.locator('.sidebar .recent-comments')).not.toContainText('Demo')
  await page.locator('html').evaluate((element) => { element.dataset.theme = 'dark' })
  await expect(widget).toHaveAttribute('theme', 'dark')
  for (const width of [1440, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await widget.evaluate((element) => element.getBoundingClientRect().right <= innerWidth + 1)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('Chinese article passes zh-CN to giscus', async ({ page }) => {
  await page.goto(route('/cn/post/legacy-compatibility/'))
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  await expect(page.locator('section.comments giscus-widget')).toHaveAttribute('lang', 'zh-CN')
})

test('article remains readable without JavaScript or a giscus iframe', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(route('/post/architecture-smoke/'))
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible()
  await expect(page.locator('section.comments')).toBeVisible()
  await expect(page.locator('giscus-widget')).toHaveCount(0)
  await context.close()
})

import { test, expect } from '@playwright/test'

const base = (process.env.PLAYWRIGHT_BASE_PATH || '').replace(/\/$/, '')
const route = (path: string) => `${base}${path}`

test.beforeEach(async ({ page }) => {
  // A deterministic iframe response prevents any GitHub read or write during tests.
  await page.route('https://giscus.app/**', (request) => request.fulfill({
    status: 200, contentType: 'text/html',
    body: '<!doctype html><html><body><script>const params=new URL(location.href).searchParams;document.documentElement.dataset.theme=params.get("theme");parent.postMessage({giscus:{resizeHeight:120}},params.get("origin"));window.addEventListener("message",event=>{if(event.origin!==new URL(params.get("origin")).origin)return;const config=event.data?.giscus?.setConfig;if(config?.theme)document.documentElement.dataset.theme=config.theme})</script>Local giscus fixture</body></html>',
  }))
})

test('configured giscus reaches an English article under a deployment base', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
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
  const iframe = widget.locator('iframe')
  await expect(iframe).toHaveCount(1)
  const parameters = new URL((await iframe.getAttribute('src'))!).searchParams
  expect(parameters.get('repoId')).toBe('R_test')
  expect(parameters.get('category')).toBe('General')
  expect(parameters.get('categoryId')).toBe('DIC_test')
  expect(parameters.get('term')).toBe(`${base}/post/architecture-smoke/`.slice(1))
  await iframe.evaluate((element) => { element.dataset.originalInstance = 'true' })
  const iframeDocument = page.frameLocator('section.comments giscus-widget iframe').locator('html')
  for (const theme of ['light', 'dark', 'light']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await page.getByRole('button', { name: `Use ${theme} theme` }).click()
    }
    await expect(widget).toHaveAttribute('theme', theme)
    await expect(iframeDocument).toHaveAttribute('data-theme', theme)
    await expect(iframe).toHaveCount(1)
    await expect(iframe).toHaveAttribute('data-original-instance', 'true')
  }
  await expect(page.locator('.sidebar .recent-comments')).not.toContainText('Demo')
  for (const width of [1440, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await iframe.evaluate((element) => {
      const box = element.getBoundingClientRect()
      return box.left >= 0 && box.right <= innerWidth + 1
    })).toBe(true)
  }
  expect(errors).toEqual([])
})

test('Chinese article passes zh-CN to giscus', async ({ page }) => {
  await page.goto(route('/cn/post/legacy-compatibility/'))
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  await expect(page.locator('section.comments giscus-widget')).toHaveAttribute('lang', 'zh-CN')
  const iframe = page.locator('section.comments giscus-widget iframe')
  await expect(iframe).toHaveCount(1)
  const url = new URL((await iframe.getAttribute('src'))!)
  expect(url.pathname).toBe('/zh-CN/widget')
  expect(url.searchParams.get('term')).toBe(`${base}/cn/post/legacy-compatibility/`.slice(1))
})

test('auto theme respects Aurora defaults and saved choice, with a system fallback', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto(route('/post/architecture-smoke/'))
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  const widget = page.locator('section.comments giscus-widget')
  const iframeDocument = page.frameLocator('section.comments giscus-widget iframe').locator('html')
  // This fixture uses Aurora's configured dark default even without a saved choice.
  expect(await page.evaluate(() => localStorage.getItem('aurora-theme'))).toBeNull()
  await expect(iframeDocument).toHaveAttribute('data-theme', 'dark')
  await page.locator('html').evaluate((element) => { delete element.dataset.theme })
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme })
    await expect(iframeDocument).toHaveAttribute('data-theme', colorScheme)
  }
  await page.getByRole('button', { name: 'Use light theme' }).click()
  await expect(iframeDocument).toHaveAttribute('data-theme', 'light')
  await expect(widget).toHaveCount(1)
  await page.reload()
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  await expect(iframeDocument).toHaveAttribute('data-theme', 'light')
})

test('a delayed Chinese iframe has a localized timeout and recovers once', async ({ page }) => {
  await page.clock.install()
  let releaseResponse!: () => void
  const pendingResponse = new Promise<void>((resolve) => { releaseResponse = resolve })
  await page.route('https://giscus.app/**', async (request) => {
    await pendingResponse
    await request.fulfill({
      contentType: 'text/html',
      body: '<script>parent.postMessage({giscus:{resizeHeight:120}},new URL(location.href).searchParams.get("origin"))</script>',
    })
  })
  await page.goto(route('/cn/post/legacy-compatibility/'))
  await page.locator('section.comments').scrollIntoViewIfNeeded()
  const iframe = page.locator('section.comments giscus-widget iframe')
  await expect(iframe).toHaveCount(1)
  const status = page.locator('.giscus-comment-host > .comment-status')
  await expect(status).toContainText('评论加载中')
  await page.clock.fastForward(16000)
  await expect(status).toContainText('评论暂时无法加载')
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible()
  releaseResponse()
  await expect(status).toHaveCount(0)
  await expect(iframe).toHaveCount(1)
})

test('article remains readable without JavaScript or a giscus iframe', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(route('/post/architecture-smoke/'))
  await expect(page.locator('article[data-pagefind-body]')).toBeVisible()
  await expect(page.locator('section.comments')).toBeVisible()
  await expect(page.locator('section.comments noscript')).toBeVisible()
  // Playwright's text matcher deliberately omits noscript nodes.
  expect(await page.locator('section.comments noscript').textContent()).toContain('JavaScript')
  await expect(page.locator('giscus-widget')).toHaveCount(0)
  await context.close()
})

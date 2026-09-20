import { test, expect } from '@playwright/test'

const docsBase = '/astro-theme-aurora'
const demoBase = `${docsBase}/demo`
const route = (path: string) => `${docsBase}${path}`
const demoRoute = (path: string) => `${demoBase}${path}`

test('documentation root, Chinese page, language switch and local search work', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_PAGES, 'This suite targets the combined Pages artifact.')
  await page.goto(route('/'))
  await expect(page).toHaveTitle(/Aurora 3\.0/)
  await expect(page.locator('.VPHomeHero')).toContainText('Aurora 3.0')
  await expect(page.getByRole('link', { name: /Live Demo/ }).first()).toHaveAttribute('href', /\/astro-theme-aurora\/demo\//)
  await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute('href', 'https://github.com/yanpuzhen/astro-theme-aurora')
  await page.getByRole('link', { name: /中文/ }).first().click()
  await expect(page).toHaveURL(/\/cn\//)
  await page.goto(route('/cn/'))
  await expect(page.locator('.VPHomeHero')).toContainText('使用文档')
  await page.goto(route('/en/guide/getting-started'))
  await expect(page.getByRole('link', { name: /Edit this page/ })).toHaveAttribute('href', /github\.com\/yanpuzhen\/astro-theme-aurora\/edit\/dev\/docs-site\/en\/guide\/getting-started\.md/)
  await page.getByRole('button', { name: /Search/ }).click()
  const search = page.locator('.DocSearch-Input, input[placeholder*="Search"]')
  await expect(search).toBeVisible()
  await search.fill('Astro')
  await expect(page.locator('.search-result, .VPLocalSearchBox')).toBeVisible()
})

test('Demo nested base, Pagefind, article, lightbox, theme and mobile navigation work', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_PAGES, 'This suite targets the combined Pages artifact.')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(demoRoute('/'))
  await expect(page).toHaveTitle(/Aurora 3\.0/)
  await expect(page.locator('main')).toContainText('Latest articles')
  await page.goto(demoRoute('/search/'))
  const input = page.getByRole('searchbox', { name: 'Search' })
  await input.fill('Aurora')
  await expect.poll(() => page.locator('.search-result').count()).toBeGreaterThan(0)
  await expect(page.locator('.search-result').first()).toHaveAttribute('href', /\/astro-theme-aurora\/demo\//)
  await page.goto(demoRoute('/post/markdown-and-code/'))
  await expect(page.locator('.post-html pre')).toBeVisible()
  await page.locator('.post-html img').click({ force: true })
  await expect(page.getByRole('button', { name: 'Close image' })).toBeVisible()
  await page.getByRole('button', { name: 'Close image' }).click()
  const before = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: before === 'dark' ? 'Use light theme' : 'Use dark theme' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', before || '')
  await page.goto(demoRoute('/'))
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.locator('#mobile-navigation a[href="https://yanpuzhen.github.io/astro-theme-aurora/"]')).toBeVisible()
  await page.getByRole('button', { name: 'Close menu' }).click()
  await page.goto(demoRoute('/routing-and-deployment/'))
  await expect(page.locator('.article-title')).toContainText('Routing & Deployment')
  await page.goto(demoRoute('/'))
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.locator('#mobile-navigation')).toBeVisible()
})

test('Demo pages remain readable without JavaScript', async ({ browser }) => {
  test.skip(!process.env.PLAYWRIGHT_PAGES, 'This suite targets the combined Pages artifact.')
  const noJs = await browser.newContext({ javaScriptEnabled: false })
  const page = await noJs.newPage()
  for (const path of ['/', '/post/welcome-to-aurora-3-cn/', '/tags/', '/categories/', '/archives/']) {
    await page.goto(demoRoute(path))
    await expect(page.locator('main')).toBeVisible()
  }
  await noJs.close()
})

import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const origin = process.env.VISUAL_ORIGIN || 'http://127.0.0.1:4322'
const base = (process.env.VISUAL_BASE || '/astro-theme-aurora/demo').replace(/\/$/, '')
const output = process.env.VISUAL_OUTPUT || 'output/playwright/visual'
const pages = {
  home: '/',
  article: '/post/demo-markdown-fundamentals/',
  math: '/post/demo-math/',
  links: '/links/',
  about: '/about/',
  archives: '/archives/',
  footer: '/#footer',
}
const viewports = [
  [1440, 900], [1280, 800], [1024, 800], [768, 1024], [390, 844], [375, 812],
]

mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true })

async function loadShowcasePage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(150)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForFunction(
    () => [...document.images].filter((image) => image.loading !== 'lazy').every((image) => image.complete && image.naturalWidth > 0),
    { timeout: 5_000 },
  ).catch(() => console.warn(`Continuing after remote image wait: ${url}`))
}

for (const theme of ['light', 'dark']) {
  const context = await browser.newContext()
  for (const [width, height] of viewports) {
    const page = await context.newPage()
    await page.setViewportSize({ width, height })
    for (const [name, path] of Object.entries(pages)) {
      const [route, fragment] = path.split('#')
      await loadShowcasePage(page, `${origin}${base}${route}?theme=${theme}${fragment ? `#${fragment}` : ''}`)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      if (scrollWidth > width) throw new Error(`${name} ${theme} ${width}px overflows at ${scrollWidth}px`)
      if (name === 'footer') await page.locator('#footer').scrollIntoViewIfNeeded()
      await page.screenshot({
        path: `${output}/${name}-${theme}-${width}x${height}.png`,
        fullPage: name !== 'footer',
      })
    }
    await page.close()
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${Object.keys(pages).length * viewports.length * 2} Showcase visual fixtures in ${output}`)

import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const origin = process.env.VISUAL_ORIGIN || 'http://127.0.0.1:4322'
const base = (process.env.VISUAL_BASE || '').replace(/\/$/, '')
const output = process.env.VISUAL_OUTPUT || 'output/playwright/visual'
const pages = {
  home: '/',
  article: '/post/legacy-markdown-parity/',
  archives: '/archives/',
  tags: '/tags/',
  search: '/search/',
}
const viewports = [
  [1440, 900], [1280, 800], [1024, 800], [768, 1024], [390, 844], [375, 812],
]

mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
for (const theme of ['light', 'dark']) {
  const context = await browser.newContext()
  for (const [width, height] of viewports) {
    const page = await context.newPage()
    await page.setViewportSize({ width, height })
    for (const [name, path] of Object.entries(pages)) {
      await page.goto(`${origin}${base}${path}?theme=${theme}`, { waitUntil: 'networkidle' })
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      if (scrollWidth > width) throw new Error(`${name} ${theme} ${width}px overflows at ${scrollWidth}px`)
      await page.screenshot({
        path: `${output}/${name}-${theme}-${width}x${height}.png`,
        fullPage: true,
      })
    }
    await page.close()
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${Object.keys(pages).length * viewports.length * 2} visual fixtures in ${output}`)

import { expect, test } from '@playwright/test'

const remote = {
  valine: 'https://unpkg.com/valine@1.5.3/dist/Valine.min.js',
  twikoo: 'https://cdn.jsdelivr.net/npm/twikoo@2.0.8/dist/twikoo.min.js',
  cloudbase: 'https://cdn.jsdelivr.net/npm/twikoo@2.0.8/dist/twikoo.all.min.js',
  walineJs: 'https://unpkg.com/@waline/client@3.15.2/dist/waline.js',
  walineCss: 'https://unpkg.com/@waline/client@3.15.2/dist/waline.css',
}

test('EN keeps 3.0.0 public-CDN provider delivery independently of Chinese site language', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.route(remote.valine, (route) => route.fulfill({ contentType: 'application/javascript', body: 'window.Valine=function(){}' }))
  const twikoo = 'window.twikoo={init:async()=>{},getRecentComments:async()=>[]}'
  await page.route(remote.twikoo, (route) => route.fulfill({ contentType: 'application/javascript', body: twikoo }))
  await page.route(remote.cloudbase, (route) => route.fulfill({ contentType: 'application/javascript', body: twikoo }))
  await page.route(remote.walineCss, (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.route(remote.walineJs, (route) => route.fulfill({ contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: 'export const init=()=>{};export const RecentComments=async()=>({comments:[]})' }))
  await page.route('https://giscus.app/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>giscus</title>' }))
  await page.goto('/')
  expect(requests.filter((url) => /(?:valine|twikoo|waline)/i.test(url))).toEqual([])
  await page.goto('/preflight/comments/')
  for (const url of [remote.valine, remote.twikoo, remote.walineJs, remote.walineCss]) {
    await expect.poll(() => requests.includes(url)).toBe(true)
  }
  expect(requests.some((url) => /\/_astro\/(?:valine|twikoo|waline)[^/]*\.(?:js|css)$/.test(url))).toBe(false)
  requests.length = 0
  await page.goto('/preflight/cloudbase/')
  await expect.poll(() => requests.includes(remote.cloudbase)).toBe(true)
})

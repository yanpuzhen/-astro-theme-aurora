import { defineConfig, devices } from '@playwright/test'

const origin = process.env.PLAYWRIGHT_ORIGIN || 'http://127.0.0.1:4321'
const basePath = (process.env.PLAYWRIGHT_BASE_PATH || '').replace(/\/$/, '')
const pagesBuild = process.env.PLAYWRIGHT_PAGES === 'true'
const serverCommand = pagesBuild
  ? 'node scripts/serve-pages.mjs --port 4321'
  : basePath
  ? `node scripts/serve-static-base.mjs --base ${basePath} --port 4321`
  : 'pnpm exec astro preview --host 127.0.0.1 --port 4321'

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  reporter: [['list'], ['html', { outputFolder: 'output/playwright/report', open: 'never' }]],
  use: { baseURL: origin, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: {
    command: serverCommand,
    url: `${origin}${pagesBuild ? '/-astro-theme-aurora/' : basePath || '/'}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

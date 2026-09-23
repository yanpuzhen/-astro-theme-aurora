import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { loadAuroraConfig } from '../src/lib/config-loader.ts'

const temporaryRoot = mkdtempSync(resolve(tmpdir(), 'aurora-config-test-'))
let counter = 0
function load(yaml, env = {}) {
  const configPath = resolve(temporaryRoot, `fixture-${counter++}.yml`)
  writeFileSync(configPath, yaml, 'utf8')
  return loadAuroraConfig({ configPath, cwd: temporaryRoot, env })
}
function throwsWith(callback, expectation) {
  assert.throws(callback, (error) => {
    const message = String(error.message)
    if (expectation instanceof RegExp) {
      assert.match(message, expectation)
    } else {
      assert.equal(typeof expectation, 'function', 'expectation must be a RegExp or predicate')
      assert.equal(expectation(error), true, 'error predicate did not accept the thrown error')
    }
    return true
  })
}

try {
  const missing = loadAuroraConfig({ configPath: resolve(temporaryRoot, 'missing.yml'), cwd: temporaryRoot, env: {} })
  assert.equal(missing.site.title, 'My Aurora Blog')
  assert.equal(missing.comments.provider, 'none')
  assert.deepEqual(missing.i18n.locales, ['en', 'zh-CN'])
  assert.ok(Object.isFrozen(missing) && Object.isFrozen(missing.theme.gradient))

  const custom = load(`
site:
  title: Config UI Smoke
  subtitle: Visible subtitle
  author: Ada Example
  description: Site configuration is working.
  avatar: /fixtures/aurora-placeholder.svg
  started_date: '2020-02-29'
  url: https://blog.example
  base: /blog/theme/
i18n:
  default_locale: en
  locales: [en, zh-CN]
theme:
  dark_mode: false
  profile_shape: rounded
  gradient:
    color_1: '#102030'
    color_2: '#405060'
    color_3: '#708090'
menu:
  home: true
  tags: false
  categories: true
  archives: true
  about: true
  links: true
socials:
  - label: GitHub
    href: https://github.com/example
    icon: github
comments:
  provider: waline
  waline:
    server_url: https://comments.example
    page_size: 12
dia:
  enabled: true
  locale: zh-CN
  tips: [你好，Dia]
footer:
  show_version: false
  statistics:
    page_views: '120'
links:
  - name: Example
    url: https://example.org
    avatar: /friend.png
    category: Friends
seo:
  keywords: [aurora, astro]
`)
  assert.equal(custom.site.title, 'Config UI Smoke')
  assert.equal(custom.site.subtitle, 'Visible subtitle')
  assert.equal(custom.site.author, 'Ada Example')
  assert.equal(custom.site.startedDate, '2020-02-29')
  assert.equal(custom.site.base, '/blog/theme/')
  assert.equal(custom.theme.profileShape, 'rounded')
  assert.deepEqual(custom.theme.gradient, ['#102030', '#405060', '#708090'])
  assert.equal(custom.menu.tags, false)
  assert.equal(custom.menu.links, true)
  assert.equal(custom.socials[0].href, 'https://github.com/example')
  assert.equal(custom.dia.enabled, true)
  assert.equal(custom.dia.tips[0], '你好，Dia')
  assert.equal(custom.comments.provider, 'waline')
  assert.equal(custom.comments.waline.pageSize, 12)
  assert.equal(custom.footer.showVersion, false)
  assert.equal(custom.links[0].name, 'Example')

  const overridden = load(`
site:
  title: YAML Title
  url: https://yaml.example
  base: /yaml/
comments:
  provider: waline
  waline:
    server_url: https://yaml-comments.example
dia:
  enabled: true
`, {
    PUBLIC_AURORA_TITLE: 'ENV Title', ASTRO_SITE: 'https://env.example', ASTRO_BASE: '/nested/base/',
    PUBLIC_COMMENT_PROVIDER: 'twikoo', PUBLIC_TWIKOO_ENV_ID: 'https://twikoo.example',
    PUBLIC_AURORA_DIA: 'false',
  })
  assert.equal(overridden.site.title, 'ENV Title')
  assert.equal(overridden.site.url, 'https://env.example')
  assert.equal(overridden.site.base, '/nested/base/')
  assert.equal(overridden.comments.provider, 'twikoo')
  assert.equal(overridden.comments.twikoo.envId, 'https://twikoo.example')
  assert.equal(overridden.dia.enabled, false)

  const aliasesWarnings = []
  const aliasPath = resolve(temporaryRoot, 'legacy.yml')
  writeFileSync(aliasPath, `
site:
  title: Legacy site
  startedDate: '2018-01-02'
  language: zh
  beian:
    number: ICP 123
    policeNumber: 公安 123
menu:
  About: true
  Tags: false
  Friends: true
valine:
  enable: true
  appId: legacy-app
  appKey: legacy-key
  recentComment: false
aurora_bot:
  enable: true
  locale: zh-CN
  tips: [Legacy Dia]
`, 'utf8')
  const legacy = loadAuroraConfig({ configPath: aliasPath, cwd: temporaryRoot, env: {}, onWarning: (message) => aliasesWarnings.push(message) })
  assert.equal(legacy.site.startedDate, '2018-01-02')
  assert.equal(legacy.site.language, 'zh-CN')
  assert.equal(legacy.menu.tags, false)
  assert.equal(legacy.menu.links, true)
  assert.equal(legacy.comments.provider, 'valine')
  assert.equal(legacy.comments.valine.appId, 'legacy-app')
  assert.equal(legacy.comments.recentComments.enabled, false)
  assert.equal(legacy.dia.enabled, true)
  assert.equal(legacy.footer.beian.policeNumber, '公安 123')
  assert.ok(aliasesWarnings.some((warning) => warning.includes('aurora_bot')))

  throwsWith(() => load('site:\n  title: [unfinished\n'), /Unable to parse .*line/i)
  throwsWith(() => load('theme:\n  profile_shape: triangle\n'), /theme\.profile_shape/)
  throwsWith(() => load('comments:\n  provider: unknown\n'), /comments\.provider/)
  throwsWith(() => load('comments: not-an-object\n'), /comments: expected object/i)
  throwsWith(() => load('comments:\n  waline: not-an-object\n'), /comments\.waline: expected object/i)
  throwsWith(() => load('comments:\n  provider: waline\n  waline:\n    server_urll: https://example.com\n'), /comments\.waline: unknown key: server_urll/)
  throwsWith(() => load('socials:\n  - label: unsafe\n    href: javascript:alert(1)\n'), /socials\.0\.href/)
  throwsWith(() => load('site:\n  started_date: 2023-02-29\n'), /site\.started_date/)
  throwsWith(() => load('site:\n  base: ../unsafe\n'), /site\.base/)
  throwsWith(() => load('', { PUBLIC_AURORA_DIA: 'sometimes' }), /PUBLIC_AURORA_DIA must be true or false/)

  const gitalkWarnings = []
  const gitalkPath = resolve(temporaryRoot, 'legacy-gitalk.yml')
  const sentinel = 'NEVER-SERIALIZE-GITALK-CREDENTIAL-7f9c'
  writeFileSync(gitalkPath, `gitalk:\n  enable: true\n  id: pathname\n  clientId: legacy-id\n  owner: legacy-owner\n  repo: legacy-repo\n  clientSecret: ${sentinel}\n  client_secret: second-${sentinel}\n  proxy: https://cors.example\n`, 'utf8')
  const legacyGitalk = loadAuroraConfig({
    configPath: gitalkPath, cwd: temporaryRoot, env: {}, onWarning: (message) => gitalkWarnings.push(message),
  })
  assert.equal(legacyGitalk.comments.provider, 'none', 'legacy Gitalk enable must not select a runtime')
  assert.equal(legacyGitalk.comments.gitalk.id, 'pathname', 'safe identity mode remains available')
  assert.deepEqual(Object.keys(legacyGitalk.comments.gitalk), ['id'], 'only identity mapping may survive migration')
  assert.ok(gitalkWarnings.some((warning) => warning.includes('runtime is not bundled') && warning.includes('security reasons')))
  assert.ok(gitalkWarnings.some((warning) => warning.includes('credential fields were ignored and removed')))
  assert.ok(gitalkWarnings.some((warning) => warning.includes('runtime settings were not imported')))
  assert.doesNotMatch(JSON.stringify(legacyGitalk), new RegExp(sentinel))
  assert.ok(gitalkWarnings.every((warning) => !warning.includes(sentinel)), 'migration warnings must never echo credential values')

  throwsWith(() => load('comments:\n  provider: gitalk\n'), /Gitalk 1\.8.*browser-visible client secret.*intentionally does not expose.*identity compatibility is retained.*Waline or Twikoo/i)
  throwsWith(() => load('site:\n  language: zh-CN\ncomments:\n  provider: gitalk\n'), /Gitalk 1\.8.*浏览器可见的客户端密钥.*刻意不暴露.*迁移.*Waline 或 Twikoo/)
  throwsWith(() => load(`comments:\n  gitalk:\n    clientSecret: ${sentinel}\n`), (error) => {
    assert.match(error.message, /OAuth credentials are not accepted/)
    assert.doesNotMatch(error.message, new RegExp(sentinel))
    return true
  })
  throwsWith(() => load('', { PUBLIC_COMMENT_PROVIDER: 'gitalk', PUBLIC_AURORA_LOCALE: 'zh-CN' }), /Gitalk 1\.8.*浏览器可见的客户端密钥.*Aurora 3 刻意不暴露.*Waline 或 Twikoo/)

  const ignoredEnvWarnings = []
  const identityEnv = loadAuroraConfig({
    configPath: resolve(temporaryRoot, 'missing-env.yml'), cwd: temporaryRoot,
    env: { PUBLIC_GITALK_CLIENT_ID: 'legacy-id', PUBLIC_GITALK_OWNER: 'legacy-owner', PUBLIC_GITALK_REPO: 'legacy-repo', PUBLIC_GITALK_PROXY: 'https://cors.example', PUBLIC_GITALK_ID_MODE: 'pathname' },
    onWarning: (message) => ignoredEnvWarnings.push(message),
  })
  assert.equal(identityEnv.comments.provider, 'none')
  assert.equal(identityEnv.comments.gitalk.id, 'pathname')
  assert.equal('clientId' in identityEnv.comments.gitalk, false)
  assert.ok(ignoredEnvWarnings.some((warning) => warning.includes('PUBLIC_GITALK_CLIENT_ID is ignored')))
  assert.ok(ignoredEnvWarnings.some((warning) => warning.includes('PUBLIC_GITALK_PROXY is ignored')))

  for (const variable of ['PUBLIC_GITALK_CLIENT_SECRET', 'GITALK_CLIENT_SECRET']) {
    throwsWith(() => loadAuroraConfig({
      configPath: resolve(temporaryRoot, `missing-${variable}.yml`), cwd: temporaryRoot,
      env: { [variable]: sentinel },
    }), (error) => {
      assert.match(error.message, /Gitalk OAuth client secrets are not accepted in environment variables/)
      assert.doesNotMatch(error.message, new RegExp(sentinel))
      return true
    })
  }

  const envExample = readFileSync('.env.example', 'utf8')
  const exampleConfig = readFileSync('_config.yml', 'utf8')
  assert.doesNotMatch(envExample, /CLIENT_SECRET|clientSecret|client_secret/i)
  assert.doesNotMatch(exampleConfig, /CLIENT_SECRET|clientSecret|client_secret/i)

  console.log('Verified Aurora config defaults, YAML errors, schema paths, environment precedence, safe Gitalk migration identity, provider rejection, and credential non-disclosure.')
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}

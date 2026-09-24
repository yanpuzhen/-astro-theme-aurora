# CDN mode implementation audit

## Baseline and motivation

Baseline: `origin/main` and `origin/dev` at `57dab0cae5a8d67d2e1183e469c9f6be08989729`; immutable `v3.0.0` at `24cce014e64590e3460f91b9091831f69f6df4be`. Upstream [Aurora issue #346](https://github.com/auroral-ui/hexo-theme-aurora/issues/346) asked for local packaging of static JS, CSS and fonts when public CDN reachability is unreliable. Aurora 2 exposed `site_meta.cdn: cn` in its theme configuration.

## Asset ownership and delivery

| Resource | Classification | EN | CN |
| --- | --- | --- | --- |
| Valine 1.5.3 | Aurora-selected comment client | unpkg | same-origin lazy Vite chunk |
| LeanCloud SDK 3.15.0 | Valine runtime dependency | Valine's existing jsDelivr loader | same-origin Vite chunk, initialized before Valine |
| Twikoo 2.0.8 HTTP / CloudBase | Aurora-selected comment client | existing jsDelivr standard / all scripts | same-origin hashed official standard / all scripts |
| Prism 1.28.0 components and themes | Optional Twikoo code highlighting | Twikoo's existing jsDelivr default | official npm package directories copied into CN build; `prismCdn` points under the configured base |
| Waline 3.15.2 JS / CSS | Aurora-selected comment client | existing unpkg module / stylesheet | lazy Vite chunk / same-origin CSS |
| Waline default emoji pack | Waline optional static dependency | upstream default | disabled: official pack is GPL-3.0-or-later and cannot be bundled in this GPL-2.0-only repository |
| giscus Vue client | Aurora-selected comment client | Vite bundle | same Vite bundle |
| giscus.app, comment APIs | Provider services | external | external |
| User avatars, article images, links | User/provider content | user selected | user selected |
| Astro/Vue, Aurora CSS/icons, Pagefind, KaTeX, Shiki, lightbox, search, theme, Dia | Aurora core | local/build-time | local/build-time |

The source audit found no Aurora-owned Google Fonts, cdnjs, esm.sh, skypack, BootCDN or Staticfile runtime dependency. External `https://` references in content, examples, SEO schema identifiers and attribution links are not runtime package dependencies. CN is an explicit build-time policy; it does not alter locale or external service endpoints.

## Verification and limits

- Config tests cover default, both locale combinations, invalid values, strict unknown fields and Aurora 2 metadata migration.
- EN browser preflight checks remote Valine, Twikoo HTTP/CloudBase, Waline JS/CSS, Recent Comments mocks, giscus and `none`.
- CN browser test records requests from home and provider preflight pages, verifies same-origin Valine, Twikoo standard/CloudBase, Waline JS/CSS and API shapes, renders Twikoo/Waline Recent Comments from deterministic backend responses, and rejects public static CDN hosts. It also tests a CloudBase-only page and verifies that an untouched page requests no provider client.
- CN builds and network tests pass at `/`, `/aurora/`, `/blog/theme/` and `/astro-theme-aurora/`. Browser tests use fixture identities and unavailable test backends; they do not prove production backend credentials, comment continuity or China-side reachability of a deployed host.
- Official package licenses inspected: Valine GPL-2.0, Twikoo MIT, Waline MIT, LeanCloud SDK MIT and Prism MIT. Waline's default emoji package is GPL-3.0-or-later, so CN deliberately disables it.

## Executed gates

- `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test` (includes config, comments, feeds and CDN artifact checks): passed.
- `pnpm demo:build`, `pnpm test:demo`, `pnpm docs:build`, `pnpm test:docs`, `pnpm pages:build`, `pnpm test:pages`, `pnpm test:i18n`, `pnpm test:readme`: passed.
- `pnpm test:browser`, `pnpm test:browser:preflight`, `pnpm test:browser:giscus`, `pnpm test:browser:pages`: passed; EN preflight includes a dedicated CloudBase CDN route.
- `pnpm test:browser:cdn:en` and `pnpm test:browser:cdn:cn`: passed.
- Four CN fixture builds using `ASTRO_BASE=/`, `/aurora/`, `/blog/theme/`, and `/astro-theme-aurora/`, each followed by `pnpm test:cdn` and `playwright test tests/browser/cdn.spec.ts` with matching `PLAYWRIGHT_BASE_PATH`: passed.
- `git diff --check` and focused credential-pattern scan of added runtime code, fixtures and audit: passed; no credentials introduced.

Local provider chunks are emitted by Vite but are not requested on the home page or by `none`/giscus. CN provider preflight requests only the selected same-origin client assets. EN provider preflight requests only the pinned public-CDN assets. Generated HTML has no public-CDN script or stylesheet tags.

## PR #9 delayed Prism resource correction

An independent Astra review found that the CN build copied Prism language components but omitted theme CSS. Sol reproduced the finding on the previous PR head (`cbe5dd0`): a mocked Twikoo `GET_CONFIG` response with `HIGHLIGHT=true`, `HIGHLIGHT_THEME=okaidia`, and `HIGHLIGHT_PLUGIN=none`, plus a rendered `language-python` comment, requested `prism-python.min.js` with HTTP 200 and `prism-okaidia.min.css` with HTTP 404.

Twikoo 2.0.8 sets Prism autoloader `languages_path` to `${prismCdn}/components/` and appends `/themes/prism-<theme>.min.css` (or `/themes/prism.min.css` for `default`). The two supported `HIGHLIGHT_PLUGIN` values, `showLanguage` and `copyButton`, load code bundled in the Twikoo client; they do not append a `plugins/` path to `prismCdn`. Aurora's CN `prismCdn` retains `import.meta.env.BASE_URL`. The build now copies `components/` and `themes/` from the installed official `prismjs@1.28.0` npm package to `dist/_astro/prismjs/1.28.0/`, only for CN. Its declared license is MIT. No replacement asset source or dependency upgrade was added.

The CN browser regression initializes the real Twikoo HTTP client, supplies a Python comment and highlight config, waits for the delayed requests, and asserts same-origin HTTP 200 for both resources, CSS content type and nonempty recognizable CSS, no forbidden public CDN request, and no uncaught page error. Root `/`, nested `/aurora/`, deep `/blog/theme/`, and Pages-style `/astro-theme-aurora/` builds each passed artifact verification and the browser test. The artifact verifier checks representative default, okaidia, and tomorrow CSS files.

The CN CloudBase preflight uses a non-HTTP env ID, loads the local `twikoo.all` client, and reaches the mocked anonymous-sign-in request for that env ID. It checks for no local `_astro` 404 and no forbidden CDN request; it does not require or validate a live CloudBase account.

`pubstatic.b0.upaiyun.com/?_upnode` originates in Valine 1.5.3's bundled `recordIPFn`: it requests a remote address for comment metadata. It is an upstream service call, not an Aurora-owned static JS/CSS/font dependency; the same Valine code runs in EN and CN. CN localization keeps Valine's backend options and uses a local `leancloud-storage@3.15.0` client initialized with the existing app ID and key and the wrapper's existing `avoscloud.com` region mapping. The default Waline emoji resource is `//unpkg.com/@waline/emojis@1.1.0/weibo`; that package declares `GPL-3.0-or-later`. CN passes `emoji: false`, so the default remote emoji pack is not requested; EN retains the upstream default. This records package metadata and delivery behavior, without a legal conclusion.

The previous Astra verdict remains REQUEST CHANGES and its review stopped at the first finding. A fresh independent review is required on the new head; this implementation document does not claim approval.

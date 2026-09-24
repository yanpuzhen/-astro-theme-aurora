# CDN mode implementation audit

## Baseline and motivation

Baseline: `origin/main` and `origin/dev` at `57dab0cae5a8d67d2e1183e469c9f6be08989729`; immutable `v3.0.0` at `24cce014e64590e3460f91b9091831f69f6df4be`. Upstream [Aurora issue #346](https://github.com/auroral-ui/hexo-theme-aurora/issues/346) asked for local packaging of static JS, CSS and fonts when public CDN reachability is unreliable. Aurora 2 exposed `site_meta.cdn: cn` in its theme configuration.

## Asset ownership and delivery

| Resource | Classification | EN | CN |
| --- | --- | --- | --- |
| Valine 1.5.3 | Aurora-selected comment client | unpkg | same-origin lazy Vite chunk |
| LeanCloud SDK 3.15.0 | Valine runtime dependency | Valine's existing jsDelivr loader | same-origin Vite chunk, initialized before Valine |
| Twikoo 2.0.8 HTTP / CloudBase | Aurora-selected comment client | existing jsDelivr standard / all scripts | same-origin versioned official scripts with narrowly checked local asset URL substitutions |
| Prism 1.28.0 components and themes | Optional Twikoo code highlighting | Twikoo's existing jsDelivr default | official npm package directories copied into CN build; `prismCdn` points under the configured base |
| Waline 3.15.2 JS / CSS | Aurora-selected comment client | existing unpkg module / stylesheet | lazy Vite chunk / same-origin CSS |
| Waline default emoji/reaction images | Waline optional static dependencies | upstream defaults | disabled; `@waline/emojis@1.1.0` declares GPL-3.0-or-later and is not redistributed in CN |
| Valine built-in emoji picker | Valine optional static dependency | upstream Sina images | removed in CN; plain-text comments remain usable |
| Twikoo OwO / Cap | Optional Twikoo features | upstream external static assets | same-origin Unicode OwO data, pinned Cap widget/WASM/fallback assets |
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
- Official package licenses inspected: Valine GPL-2.0, Twikoo MIT, Waline MIT, LeanCloud SDK MIT, Prism MIT, Cap Apache-2.0, pako MIT/Zlib, and Font Awesome Free's distributed notice. Waline's default emoji package declares GPL-3.0-or-later; CN does not redistribute it. This engineering review makes no legal compatibility determination.

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

On the first CI head after this correction, the RC browser job failed while interacting with search immediately after navigation: Pagefind search had no results, and a retry also showed the header search link following its static fallback. Build and Pagefind index generation passed. The browser tests now wait for Astro's search island to shed its `ssr` attribute before interacting; Pagefind timeout and product search behavior are unchanged. The local RC browser suite passed after this synchronization change.

`pubstatic.b0.upaiyun.com/?_upnode` originates in Valine 1.5.3's bundled `recordIPFn`: it requests a remote address for comment metadata. It is an upstream service call, not an Aurora-owned static JS/CSS/font dependency; the same Valine code runs in EN and CN. The prior CN wrapper used an `avoscloud.com` region mapping; F4 below corrects it to match upstream Valine's `leancloud.cn` mapping. The default Waline emoji resource is `//unpkg.com/@waline/emojis@1.1.0/weibo`; that package declares `GPL-3.0-or-later`. CN passes `emoji: false`, so the default remote emoji pack is not requested; EN retains the upstream default. This records package metadata and delivery behavior, without a legal conclusion.

The previous Astra verdict remains REQUEST CHANGES and its review stopped at the first finding. A fresh independent review is required on the new head; this implementation document does not claim approval.

## Second review findings F1–F6 and Sol corrections

The second independent Astra review found three P1 delayed static requests and three P2 parity/distribution/documentation defects. This section records Sol's changes; it is not an Astra approval.

| Finding | Reproduction and resolution |
| --- | --- |
| F1 Waline reaction | `reaction: true` maps to six hardcoded `@waline/emojis/tieba` PNGs. CN now warns at build time, normalizes the setting to `false`, and forces `reaction: false` in the local client for direct callers. EN keeps the default images. |
| F2 Valine emoji | Valine 1.5.3 has `emojiMaps` but no supported emoji-off switch. CN supplies an empty map and removes the rendered picker and panel; text comments and EN's upstream picker remain. Sina-hosted images are not redistributed. |
| F3 Twikoo OwO / Cap | Twikoo 2.0.8 hardcodes an OwO JSON fallback and the unpinned jsdmirror Cap script. A shared deterministic asset generator checks the exact upstream strings and replaces both official HTTP/CloudBase UMD bundles' OwO, Cap, and Prism fallback paths with versioned same-origin paths for static builds and the dev server. Aurora authors its small Unicode OwO JSON; backend `EMOTION_CDN` cannot redirect CN's static resource. Cap uses exact `@cap.js/widget@0.1.58`, `@cap.js/wasm@0.0.8`, and `pako@2.1.0`, including delayed WASM and fallback assets. Twikoo's challenge, redeem, token, and `COMMENT_SUBMIT` logic is untouched. |
| F4 Valine host | Upstream Valine selects `leancloud.cn`, with `tab.` and `us.` suffixes for its two recognized App ID suffixes. CN's local SDK init now uses that same mapping. Browser tests compare the EN and CN `Comment` request host, App ID, and App Key-derived signature with the same fixture. |
| F5 Notices | Normal builds create `dist/THIRD_PARTY_NOTICES.txt` and copy verbatim installed package licenses under `dist/_licenses/`, including Valine, Twikoo, Waline, LeanCloud, Prism, Cap widget/WASM, pako, and Font Awesome Free icon material. `@cap.js/wasm` declares Apache-2.0 but its npm package omits a LICENSE file; the exact LICENSE text copied from the same Cap upstream project's widget package is identified in the notice. Artifact tests inspect the final `dist`, for both EN and CN. |
| F6 Metadata | End-user EN/ZH docs and Unreleased changelog now state `GPL-3.0-or-later` for `@waline/emojis@1.1.0`. The unsupported legal incompatibility conclusion was removed. |

The browser regression exercises CN Waline reaction configuration, Valine emoji absence and plain-text editor, Twikoo OwO opening, Cap script/WASM loading and failed unverified submission, and delayed Prism. It rejects the public static hosts named in the review while asserting the expected resources are same-origin. External LeanCloud, Twikoo, Waline, CloudBase, giscus, avatar, and Valine IP lookup requests are service/API traffic rather than Aurora-managed static dependencies. The upstream EN interaction tests retain the original remote provider behavior.

# giscus replacement implementation — PR #6 delta

## Baseline and review state

- Baseline before this delta: `dev`/PR #6 head `440ad6081d8ec3191fbf6d8d4bc3e6ea6bd50879`; `main` `28725111385f36b3b9b3bf424cb8afe5b271e25c`.
- PR #6 was OPEN, unmerged, and mergeable at baseline. The previous Astra approval reviewed an earlier head. It does not review this delta. **Current head requires GPT-6 Astra giscus delta review before merge.**
- RC2 tag target was `b0e2d10d16a83c487c112d3a030acbe6d47d9a60`. Package version remains `3.0.0-rc.2`.

## Gitalk audit and removal

The pre-change audit found no Gitalk JS/CSS constructor adapter, but found active canonical `comments.gitalk.id`, `PUBLIC_GITALK_ID_MODE`, a runtime identity union, preflight identity markup, and tests/docs describing identity compatibility as an Aurora 3 provider concept. These active entry points were removed. `CommentProvider`, the schema, `_config.yml`, normal ENV, adapter map, `CommentIsland`, and generated runtime assets no longer offer Gitalk. Stale `comments.provider: gitalk` now fails with English or Chinese migration guidance. Canonical `comments.gitalk` is an unknown key.

Aurora 2 root `gitalk` is detected by presence only, discarded without copying or reading its fields, and emits a value-free warning. Obsolete Gitalk ENV names are ignored without reading values. A malformed YAML error no longer includes the parser's source excerpt, preventing a legacy secret from appearing in an error. `src/lib/migration/gitalk.ts` exists solely to compare historical UID/pathname keys when converting Issues to Discussions; tests import it, runtime comments do not. Legacy source snapshots, migration/ADR documents, and earlier review evidence retain truthful historical references. Review snapshots are marked as superseded where necessary; `ASTRA_STABLE_PREFLIGHT_REVIEW.md` was left intact.

## Official integration and configuration

- Official sources inspected on 2026-09-24: [giscus README](https://github.com/giscus/giscus), [giscus component README](https://github.com/giscus/giscus-component), official Vue component and web component source, and npm `latest`. Exact pinned dependency: `@giscus/vue@3.1.1`, with its lockfile dependency `giscus@1.6.0`.
- The component supports `repo`, `repoId`, `category`, `categoryId`, `mapping`, `term`, `strict`, `reactionsEnabled`, `emitMetadata`, `inputPosition`, `theme`, `lang`, and `loading`. Aurora exposes a bounded public subset with boolean YAML values, translated to the component's `0`/`1` props.
- Required giscus selection validates a GitHub `owner/repository`, nonempty opaque `repo_id`, and `category_id` for automatic discussion creation. `mapping: number` requires a positive discussion number instead and may omit category ID; `mapping: specific` requires a term. Unsupported mapping/theme/locale values fail at build time. No arbitrary script URL, custom theme CSS URL, OAuth secret, or PAT is accepted.
- Default `mapping: pathname` follows the browser's deployed path, so `ASTRO_BASE`, locale routes, and custom permalinks affect Discussion identity. `specific` supports `term: "{legacyUid}"` for per-page stable UID mapping. A literal specific term or globally configured discussion number makes pages share a Discussion; docs warn about this. Historical Gitalk Issues are not matched automatically.
- `theme: auto` follows Aurora's resolved `html[data-theme]` for Light/Dark and follows `prefers-color-scheme` when that attribute is absent. The official Vue component mounts the official web component; Aurora reflects later theme changes onto its public `theme` attribute because the tested Vue wrapper does not forward that update after the custom element is upgraded. The web component updates its iframe configuration by `postMessage`, without remounting the widget. Aurora's existing theme controls normally resolve the default to `data-theme`; giscus does not change that site-wide policy.
- `lang: auto` maps Aurora routes to `en` or `zh-CN`. Aurora uses `client:visible`; giscus iframe `loading: eager` is the default to avoid double lazy loading. Aurora clears its loading label only after a giscus resize message from the expected origin and iframe source, and shows a localized error after 15 seconds without one. The article stays static and readable if comments fail or JavaScript is disabled.
- giscus stores comments in GitHub Discussions and authenticates via its App. Aurora does not need a browser OAuth client secret. giscus iframe content remains outside Aurora's DOM/CSS. CSP deployments must permit giscus.app frame and required connections.
- giscus has no Aurora Sidebar Recent Comments or comment-count integration. The Sidebar shows the normal unavailable state; Demo recent comments remain local fixtures.

## Validation performed

- `pnpm install --frozen-lockfile --offline`, `pnpm check`, `pnpm test`, `pnpm docs:build`, `pnpm test:docs`, `pnpm test:i18n`, `pnpm test:readme`: passed.
- `pnpm test:browser:preflight`: 5 passed, including an aborted giscus iframe with localized timeout status and a special-character `specific` term that remains an attribute rather than executable HTML. `pnpm test:browser:giscus`: 3 passed against a configured English/Chinese nested-base build with local giscus iframe mocks. Root RC browser suite: 7 passed, including no-JS. giscus browser checks cover theme changes and widths 1440, 1024, 768, 390, and 375.
- `pnpm demo:build`, `pnpm test:demo`, Demo feed check, `pnpm pages:build`, `pnpm test:pages`, and Pages browser suite: passed (5 Pages browser tests). EN/ZH RSS, sitemap, robots, Docs, Demo, Pagefind, and Pages artifact remained valid.
- Generated `dist` and `.pages-dist` scans found no Gitalk runtime asset, Gitalk ENV field, OAuth secret field, or sentinel value. Local mocks never post to GitHub.

## External limits

No production giscus repository/App/Discussion credentials or converted Gitalk records were supplied. Real Discussion creation, old-record continuity, and live giscus availability were not externally verified. Waline/Twikoo/Valine production backends likewise remain site-specific checks. No Stable release or merge was started.

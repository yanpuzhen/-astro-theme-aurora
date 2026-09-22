# Aurora 3.0 Luna implementation handoff

## Implementation status

COMPLETE FOR ASTRA REVIEW

This branch contains the requested documentation, Demo, README parity, Pages staging, CI, browser checks, and handoff records. The production Pages site is intentionally not claimed as deployed until `dev → main` is reviewed and merged.

## Branch and release safety

- `dev` was created from the latest `origin/main` at the start of this implementation and pushed without force.
- `main` and the immutable `v3.0.0-rc.1` tag were not rewritten.
- Production Pages is triggered only by `main`; `dev` validates but does not publish.

## Pages architecture

`pnpm pages:build` runs the VitePress documentation build and the real Astro Demo build, then stages them independently:

```text
.pages-dist/
  index.html       # VitePress documentation root
  en/
  cn/
  demo/
    index.html     # Astro Demo
    pagefind/
    post/
    tags/
```

Documentation uses `/astro-theme-aurora/`. Demo uses `/astro-theme-aurora/demo/`. `scripts/verify-pages.mjs` checks both paths, required pages, Pagefind metadata, and unbased root-relative links.

`.github/workflows/pages.yml` uses official checkout, pnpm, Node, configure-pages, upload-pages-artifact, and deploy-pages actions with `pages` concurrency and `contents: read`, `pages: write`, `id-token: write` permissions.

Manual action after merge, if repository settings do not already select it: GitHub Settings → Pages → Source → GitHub Actions.

## Demo scope

The Demo selects only content with `demo: true`, so migration fixtures remain available to regression builds without becoming public demo content. It includes:

- English and Chinese welcome articles;
- Markdown headings, tables, task lists, Shiki metadata, and images;
- gallery/lightbox content;
- tags, categories, archives, search, theme switching, mobile navigation;
- an explicit custom-permalink article;
- no OAuth secret and no external comment backend.

The Demo is the current Astro implementation, not a screenshot or parallel theme.

## Documentation decisions

VitePress `1.6.4` is a root documentation devDependency. Local search is used instead of copying the upstream Algolia credentials. English and Chinese pages mirror the original information architecture, but all current behavior claims were rewritten from `package.json`, `astro.config.mjs`, `src/content.config.ts`, content helpers, routes, layouts, islands, `.env.example`, and `MIGRATION.md`.

## README decisions

The README preserves the original centered branding, title/subtitle, badge block, bilingual preview/document links, feature/theme/configuration/feedback/community/credits structure, and screenshot rhythm. It removes npm claims, old Vue/Hexo runtime claims, and upstream donation/support identity. Screenshots in `previews/` were captured with Playwright from the current dev branch's real combined Demo artifact.

## Known mismatches and limitations

- The current RC does not implement upstream author archives or every legacy
  fence/image-source behavior. The Showcase pass now covers build-time math,
  localized social/profile data, Demo recent-comment fixtures, categorized
  Friend Links, and the full static footer surface while retaining provider-safe
  empty states for ordinary builds.
- Production comment-provider records were unavailable, so identity continuity is documented but not externally proven.
- The Pages URL is a target until the PR is merged and the main-only workflow succeeds.
- The Demo uses deterministic seeded remote covers/avatars and does not download
  remote bytes during the build; it demonstrates the image/lightbox contract
  without importing unrelated upstream photography.
- GitHub repository Pages source and homepage settings were not changed from the local workspace; verify Pages source manually if required.

## Astra review required

Please independently review, without treating this handoff as an architecture approval:

1. Whether the `demo: true` build selector and one-artifact staging fit the frozen release architecture.
2. Whether legacy route aliases, UID identity, and nested-base links are sufficient for the production corpus.
3. Whether README feature claims remain strictly consistent with current source.
4. Whether VitePress configuration, local search, bilingual navigation, and edit links are correct for the intended Pages URL.
5. Whether the Pages workflow permissions, action versions, main-only trigger, and repository Pages setting are acceptable.
6. Whether upstream branding, MIT attribution, current GPL licensing, and omitted donation/support identity are handled correctly.
7. Whether adding `demo` to the content schema and publishing a public Demo fixture set introduces any compatibility or security regression.

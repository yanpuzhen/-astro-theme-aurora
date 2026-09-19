# Aurora 3.0

Aurora 3.0 is the Astro-based evolution of Aurora: a static, responsive theme with legacy Aurora compatibility and focused Vue islands for interaction.

## Highlights

- Astro static rendering with Content Collections
- Vue islands for search, comments, lightbox, code copy, theme, and mobile navigation
- Pagefind search, including Chinese and mixed-language content
- Legacy frontmatter, UID, permalink, and comment-identity compatibility
- Responsive light/dark theme with no-JavaScript-readable content
- SEO metadata, JSON-LD, RSS, sitemap, robots, and base-path deployment

## Quick start

Aurora 3.0 requires Node.js `18.20.8`, Node.js `20.3` or newer within the Node 20 line, or Node.js `22` or newer. Node.js 20 LTS is recommended. Use pnpm `11.19.0` (pnpm `7.1.0` or newer is required by the dependency tree).

```sh
git clone https://github.com/yanpuzhen/-astro-theme-aurora.git
cd ./-astro-theme-aurora
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at `http://localhost:4321`. For a production build:

```sh
pnpm test
pnpm check
pnpm build
pnpm preview
```

The repository is intentionally marked as a private package to prevent accidental npm publication. RC1 is distributed through the GitHub repository and GitHub Release; use `pnpm pack` only when auditing package contents.

## Deployment configuration

`ASTRO_SITE` and `ASTRO_BASE` configure the public URL and deployment prefix. For example:

```sh
ASTRO_SITE=https://example.com ASTRO_BASE=/aurora/ pnpm build
```

The same source is validated for `/`, `/aurora/`, and `/blog/theme/`. Copy [.env.example](.env.example) for optional locale, Dia, and comment-provider configuration. Values beginning with `PUBLIC_` are intentionally public build-time configuration; never put OAuth client secrets or API tokens in them.

Gitalk requires a trusted OAuth/proxy service when enabled. This static repository does not accept or serialize a Gitalk client secret. See [MIGRATION.md](MIGRATION.md) and [the blocker note](docs/migration/BLOCKERS.md) before enabling comments in production.

## Migrating from Aurora 2.x

Start with [MIGRATION.md](MIGRATION.md). It distinguishes automatic compatibility from manual migration, changed behavior, deprecated APIs, and known limitations. The migration audit and validation evidence are in [docs/migration](docs/migration/).

The most important change is architectural: Astro now renders routes and article HTML at build time. The old Vue SPA, Vue Router, runtime article JSON API, and legacy `/api/*.json` generation are not part of Aurora 3.0. Markdown scripts are inert or removed by default; trusted embeds require an explicit, reviewed integration.

## Comments and compatibility

Aurora 3.0 includes adapters for Gitalk, Valine, Twikoo, and Waline. Legacy UID, canonical path, historical comment path, and provider-specific aliases are emitted in the route manifest. Production provider records were not available in this repository, so continuity of existing provider threads must be checked against the real migrated site.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm check
pnpm build
pnpm run test:browser
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report bugs, migration issues, and browser/device problems at the [issue tracker](https://github.com/yanpuzhen/-astro-theme-aurora/issues).

## Attribution and license

Aurora 3.0 is a new Astro implementation informed by an audit of the upstream [Aurora Hexo theme](https://github.com/auroral-ui/hexo-theme-aurora) and [Aurora Hexo plugin](https://github.com/auroral-ui/hexo-plugin-aurora). Their source was inspected for compatibility behavior; it is not copied into this repository. The repository is distributed under [GPL-2.0-only](LICENSE), as established by the repository license.

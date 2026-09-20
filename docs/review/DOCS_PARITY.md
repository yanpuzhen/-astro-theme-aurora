# Documentation parity record

Reference inspected from the original `auroral-ui/hexo-theme-aurora-docs` repository: VitePress config, English/Chinese home pages, navigation, and the guide/config/upgrade pages. The original structure is retained as information architecture; prose is rewritten from the Aurora 3 source of truth.

| Upstream page / area | Aurora 3 page | Status | Intentional difference |
| --- | --- | --- | --- |
| `/en/guide/getting-started` | `/en/guide/getting-started` | Complete | Documents Node 22, pnpm, Astro, Demo build, and one Pages artifact. |
| `/cn/guide/getting-started` | `/cn/guide/getting-started` | Complete | Chinese guide mirrors current commands and base-path rules. |
| `configs/general` | `configs/general` | Complete | Describes real env/config fields, not Hexo YAML. |
| `configs/menu` | `configs/menu` | Complete | Documents typed menu and mobile fallback. |
| `configs/theme` | `configs/theme` | Complete | Documents theme persistence and actual config boundary. |
| `configs/router` | `configs/routing` | Complete | Renamed to match the current route resolver. |
| `configs/post` | `configs/post` | Complete | Frontmatter reference is checked against `src/content.config.ts`. |
| `configs/page` | `configs/page` | Complete | Taxonomies and unsupported author/sidebar routes are explicit. |
| `configs/social` | `configs/social` | Complete | Records normalized author socials without claiming a missing panel. |
| `configs/plugins` | `configs/integrations` | Complete | Pagefind, comments, islands, feeds, and metadata replace legacy plugin framing. |
| `configs/site-meta` | `configs/site-meta` | Complete | Canonical, OpenGraph, Twitter, JSON-LD, RSS, sitemap, robots. |
| `configs/markdown` | `configs/markdown` | Complete | Remark/Rehype/Shiki support and inert scripts are source-verified. |
| Upgrade index / v2 pages | `upgrade/from-aurora-2`, `upgrade/aurora-3-rc` | Complete | Rewritten as user migration guidance; engineering audit remains in `docs/migration/`. |
| Upstream home pages | root, `/en/`, `/cn/` | Complete | Root and English aliases are emitted so Pages smoke checks cover both. |
| Original Algolia search | VitePress local search | Complete | No upstream app ID, API key, or index name copied. |
| Original logo and sponsor links | Local favicon mark and upstream attribution only | Intentional | No donation identity presented as current project support. |
| Original footer owner | Aurora 3 current project + original Aurora attribution | Complete | Does not claim current ownership for Benny Guo. |
| Original docs deployment | VitePress output staged with Demo in `.pages-dist` | Complete | One GitHub Pages deployment, not two. |

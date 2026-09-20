# README parity record

Reference inspected from `auroral-ui/hexo-theme-aurora` at the RC1 implementation start. This record tracks the original presentation structure while documenting Aurora 3.0 from current source rather than copying obsolete claims.

| Upstream README section | Aurora 3 implementation | Status | Notes |
| --- | --- | --- | --- |
| Centered Aurora logo, title, subtitle | Centered local `public/favicon.svg`, Aurora 3.0 title, Astro subtitle | Complete | Uses repository-owned branding asset. |
| Stars, forks, issues | Same shields, pointed at `yanpuzhen/astro-theme-aurora` | Complete | Repository identity changed intentionally. |
| npm version/downloads | Removed | Intentional | Aurora 3 is not published to npm. |
| Release, last commit, license, CI | Added GitHub release, last-commit, license, and Actions badges | Complete | No npm claims. |
| Preview / Change Log / Document | Final GitHub Pages Preview, repository Change Log, Pages Document | Complete | URLs are authoritative after main merge and deployment. |
| Chinese preview / change log / document | Chinese links use the same Pages site and `/cn/` | Complete | No second docs deployment. |
| Home Page / Article Section / Article Detail screenshots | `previews/home-page.png`, `article-section.png`, `article-detail.png` | Complete | Captured from the current dev branch Pages artifact with Playwright. |
| Friends links screenshot | Replaced with mobile screenshot | Intentional | Friends-link UI is not claimed by Aurora 3 RC. |
| What's in Aurora / Features | Static Astro, Content Collections, Pagefind, bilingual, taxonomy, SEO, islands, nested base | Complete | Claims checked against source and generated output. |
| Theme | Aurora gradients, responsive cards, light/dark/system, readable no-JS HTML | Complete | Vue SPA claim removed. |
| Configuration | `ASTRO_SITE`, `ASTRO_BASE`, content collections, comment env placeholders | Complete | No legacy Hexo install instructions presented as current. |
| Sponsors / Donations | Omitted from current-project body | Intentional | Upstream identity is not presented as the current maintainer. |
| Feedback / Community | Current repository Issues/Discussions only; upstream community clearly labelled | Complete | No inherited QQ, Telegram, Discord support claim. |
| Vue SPA / Hexo install / runtime JSON API | Explicitly described as removed architecture | Complete | Historical context only. |
| Credits | Original Aurora and docs repository attributed separately | Complete | Current repository license remains authoritative for current code. |

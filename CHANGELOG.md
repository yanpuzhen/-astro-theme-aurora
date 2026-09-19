# Changelog

## 3.0.0-rc.1 - Release Candidate

Aurora 3.0 is the Astro-based evolution of Aurora. This release candidate is intended for migration testing and feedback; it is not a stable release.

### Highlights

- Static Astro rendering with Content Collections and a single Remark/Rehype/Shiki Markdown pipeline.
- Focused Vue islands for search, comments, lightbox, code copy, Dia, theme persistence, and mobile navigation.
- Pagefind search with Chinese, English, and mixed-language fixture coverage.
- Responsive Aurora styling, dark/light theme support, no-JavaScript-readable pages, and base-path deployment.

### Added

- Legacy frontmatter normalization, MD5 title-hash UIDs, explicit permalinks, `.html` compatibility redirects, and route collision checks.
- Static posts, pages, pagination, tags, categories, archives, RSS, sitemap, robots, canonical metadata, OpenGraph, and JSON-LD.
- Provider adapters and identity aliases for Gitalk, Valine, Twikoo, and Waline.
- Release documentation, environment placeholders, repository metadata, and GitHub Actions validation.

### Changed

- Astro owns routing and HTML generation; the former Hexo/Vue SPA, Vue Router, runtime article API, and `/api/*.json` generation are not included.
- Pagefind replaces the runtime search store.
- Markdown scripts are removed or inert by default. Trusted embeds require an explicit reviewed integration.

### Legacy compatibility

Legacy compatibility is validated with legacy-shaped fixtures and route manifests. Existing production comment threads, changed slugs, and a complete real article corpus still require site-specific verification.

### Validation

The RC validation suite covers clean static output, route and identity regressions, Pagefind, root and nested base paths, browser interaction, and no-JavaScript content. The final release checklist records the exact command results for this publication.

### Known limitations

- Production comment-provider records and continuity were not available for direct verification.
- Pixel-level parity against the old runtime was source-based because the old runtime and production corpus were unavailable.
- Optional author routes, comment counts/recent-comment data, complete fence metadata, and responsive image-source coverage remain conditional on a real migration corpus.

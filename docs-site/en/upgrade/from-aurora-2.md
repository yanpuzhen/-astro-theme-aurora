# From Aurora 2.x

Aurora 3.0 is a static Astro implementation, not a package-level Hexo theme upgrade. Keep the old generated site and comment-provider configuration until the new URLs and identities are checked.

## Migration outline

1. Copy posts to `src/content/posts/` and pages to `src/content/pages/`.
2. Keep legacy frontmatter while the collection schema and build checks run.
3. Review every custom permalink and title-derived UID; changing a title can change the legacy hash.
4. Copy public assets and change root-relative references to base-aware paths.
5. Set `ASTRO_SITE` and `ASTRO_BASE` for the target deployment.
6. Compare representative comment identities for the provider in use.
7. Run root and nested-base builds, browser checks, search, and no-JavaScript checks before changing traffic.

The adapter accepts scalar/list tags and categories, legacy author shapes, `feature`, `sticky`, `pinned`, comment aliases, explicit UIDs, custom permalinks, and `.html` compatibility aliases where the route can be emitted safely.

## Deliberate differences

There is no Vue Router, SPA article store, runtime `/api/*.json`, or automatic Markdown script execution. Pagefind replaces runtime article search data. Author pages, comment counts/recent comments, and complete legacy fence/image-source behavior remain conditional or unsupported in this RC.

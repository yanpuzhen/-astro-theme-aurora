# Aurora 3.0 RC1

Aurora 3.0 RC1 is a release candidate for migration testing. It is not a stable release.

This release moves Aurora's route generation, content rendering, SEO, taxonomy, and search index to Astro's static build. Vue remains limited to focused islands. Legacy-shaped frontmatter, title-hash UIDs, custom permalinks, `.html` aliases, and provider-specific comment identity aliases are preserved where the migration contract can establish them.

Before using this release on a real site:

- run the migration guide against a copy of the existing content;
- verify representative URLs and the generated route manifest;
- compare Gitalk, Valine, Twikoo, or Waline identities with existing provider records;
- test root and nested-base previews on the browsers and devices that matter to the site;
- report bugs and migration issues at https://github.com/yanpuzhen/-astro-theme-aurora/issues.

Known limitations are documented in [MIGRATION.md](../../MIGRATION.md) and the RC validation record. Production comment records were unavailable, and visual parity was source-based because the old runtime and production corpus were unavailable.

# Aurora 3.0 RC2

Aurora 3.0 RC2 is a prerelease for migration testing and bilingual site validation. It is not a stable release.

## Highlights

- Restores the original Aurora visual system on the static Astro implementation.
- Adds English / Simplified Chinese i18n across the blog, UI, Demo, and documentation.
- Adds static locale routes, accessible language switching, translated content pairs, locale-isolated Pagefind search, and canonical/hreflang metadata.
- Preserves legacy default-locale routes, title-hash identity inputs, custom permalinks, `.html` aliases, route manifests, and provider-specific comment identity modes.
- Publishes bilingual Docs and Demo content through the combined GitHub Pages artifact.

## Links

- Docs: https://yanpuzhen.github.io/astro-theme-aurora/
- Chinese Docs: https://yanpuzhen.github.io/astro-theme-aurora/cn/
- Demo: https://yanpuzhen.github.io/astro-theme-aurora/demo/
- Issues: https://github.com/yanpuzhen/astro-theme-aurora/issues

## Validation

The release gates cover static route and identity checks, bilingual i18n checks, Pagefind locale behavior, root and nested-base builds, Docs/Demo/Pages artifact checks, browser switching and search, and no-JavaScript readability.

Production comment-provider continuity and pixel-level parity against the old runtime remain unverified because the required external records and production corpus were unavailable.

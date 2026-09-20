# Routing

`src/lib/routing.ts` is the single public route resolver. It supplies post links, canonical metadata, comments, pagination cards, aliases, and the route manifest.

## Post routes

- Default: `/post/<slug>/`
- Explicit `permalink`: the normalized path from frontmatter
- UID mode: `/post/<legacyUid>/` when `ASTRO_PATH_SLUG=uid`
- Compatibility alias: `/post/<slug>.html` and verified slug/UID aliases where applicable

The default slug is the content filename. `slug` overrides it. A legacy UID comes from `legacyUid` or `uid`; if neither is present, Aurora preserves the audited title hash algorithm (`post_uid___<title>` for posts and `page_uid___<title>` for pages).

## Base paths

`ASTRO_BASE=/` is a root deployment. For GitHub Pages, use the complete project prefix:

```sh
ASTRO_BASE=/-astro-theme-aurora/demo/
```

The generated URL for `src/content/posts/welcome-to-aurora-3.md` is then `/-astro-theme-aurora/demo/post/welcome-to-aurora-3/`. Do not hard-code `/` in content links or templates.

Route collisions, reserved taxonomy paths, and duplicate aliases fail the build. The static `route-manifest.json` records canonical paths, aliases, UIDs, and comment paths.

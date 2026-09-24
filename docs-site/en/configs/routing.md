# Routing

`src/lib/routing.ts` is the single public route resolver. It supplies post links, canonical metadata, comments, pagination cards, aliases, and the route manifest.

## Post routes

- Default: `/post/<slug>/`
- Explicit `permalink`: the normalized path from frontmatter
- UID mode: `/post/<legacyUid>/` when frontmatter sets `permalinkMode: uid`
- Compatibility alias: `/post/<slug>.html` and verified slug/UID aliases where applicable

The default slug is the content filename. `slug` overrides it. A legacy UID comes from `legacyUid` or `uid`; if neither is present, Aurora preserves the audited title hash algorithm (`post_uid___<title>` for posts and `page_uid___<title>` for pages).

## Base paths

`ASTRO_BASE=/` is a root deployment. For GitHub Pages, use the complete project prefix:

```sh
ASTRO_BASE=/my-blog/
```

The generated URL for `src/content/posts/hello.md` is then `/my-blog/post/hello/`. Set `ASTRO_SITE=https://username.github.io` as the separate origin. See [Domains and Base Paths](/deploy/domains-and-base).

Route collisions, reserved taxonomy paths, and duplicate aliases fail the build. The static `route-manifest.json` records canonical paths, aliases, UIDs, and comment paths.

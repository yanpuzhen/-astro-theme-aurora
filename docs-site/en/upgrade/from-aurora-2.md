# From Aurora 2.x

Aurora 3 is a static Astro implementation, not an in-place Hexo runtime upgrade. Preserve the old site and provider records until canonical URLs and comment identities have been compared.

## Migrate configuration

Copy the concepts you use into the root `_config.yml`; routine settings no longer belong in `src/lib/config.ts`. Effective precedence is **environment overrides > `_config.yml` > Aurora defaults**. `ASTRO_SITE` and `ASTRO_BASE` are convenient deployment overrides. Missing YAML falls back to defaults; invalid canonical YAML fails the build.

| Aurora 2 concept | Aurora 3 destination | Compatibility |
| --- | --- | --- |
| `site.title/author/description/avatar/language` | `site.*` | Same concept; normalized names. |
| `site.started_date` | `site.started_date` | Same; `startedDate` alias also accepted. |
| `site.url/root` | `site.url` + `site.base` | Split origin and deployment path. |
| `menu` title/url objects | boolean `menu` flags | Built-in routes only; custom labels/targets are not imported. |
| `socials` object | list of `{ label, href, icon }` | Links retained where mappable; custom HTML icons are not. |
| root provider sections | `comments.provider` + `comments.<provider>` | Selected camelCase aliases normalize. |
| `aurora_bot` | `dia` | Renamed with a warning. |
| `site.beian` / `police_beian` | `footer.beian` | Moved with a warning. |
| `site_meta` | `site` / `seo` | Partial mapping with a warning. |
| `busuanzi` | none | No analytics backend is included. |
| `authors`, `copy_protection`, `injects`, `footer_links`, legacy Shiki options | none | Not supported; warnings explain dropped fields. |

Example:

```yaml
site:
  title: My Blog
  author: Your Name
  url: https://example.com
  base: /
comments:
  provider: waline
  waline:
    server_url: https://comments.example.com
```

### Gitalk security difference

Aurora retains Gitalk's legacy UID/pathname identity calculation, aliases, Aurora 2 migration recognition, and historical data mapping only. Upstream Gitalk 1.8 requires a browser-visible client secret for its OAuth/client flow. Aurora 3 intentionally does not expose that secret, bundle Gitalk, build an OAuth backend, or fork Gitalk. A legacy root `gitalk.enable: true` does not select a provider; only safe identity fields are normalized and runtime/credential fields are ignored or rejected with warnings. Canonical `comments.provider: gitalk` fails with localized configuration guidance recommending Waline or Twikoo. This accepted legacy-compatibility role is not a Stable Preflight blocker.

## Content and verification

1. Copy posts to `src/content/posts/` and pages to `src/content/pages/`; keep legacy frontmatter until checks pass.
2. Preserve exact title inputs when legacy UIDs are derived; changing whitespace or Unicode normalization can change IDs.
3. Review custom permalinks, `.html` aliases, and base-aware assets.
4. Set `site.url`/`site.base` in YAML or override them in the deployment environment.
5. Compare actual provider IDs/records before switching traffic. Fixtures cannot prove production continuity.
6. Run `pnpm test`, `pnpm check`, `pnpm test:browser:preflight`, root and nested-base builds, `pnpm pages:build`, and `pnpm test:pages`.

Astro owns static routes, content, SEO, feeds, and HTML. Vue Router, SPA article state, runtime `/api/*.json`, analytics backends, Gitalk's unsafe static secret flow, and automatic Markdown scripts are not part of Aurora 3.

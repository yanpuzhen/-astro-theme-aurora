# Aurora 3 Stable Preflight — Implementation and Evidence Boundaries

## Scope

This preflight adds the user configuration pipeline, comment adapter readiness and Recent Comments, and RSS/sitemap/robots build outputs while retaining the frozen architecture: Astro owns static routes/content/SEO; Vue remains focused browser islands; English remains unprefixed and Chinese uses `/cn/`.

## User configuration

- Root `_config.yml` is the user-facing interface.
- Build-time pipeline is YAML parse → selected legacy alias normalization → strict Zod validation/defaults → environment overrides → deep-frozen normalized config.
- Precedence is **environment > YAML > defaults**.
- Invalid YAML/unknown canonical fields/invalid values fail with a path; a missing config file uses defaults.
- Components do not parse YAML. Islands receive only their required serializable settings.
- `ASTRO_SITE`/`ASTRO_BASE` remain deployment overrides. `PUBLIC_*` are public browser/build values and never secret storage.
- Demo content/profile/recent comments remain separate deterministic showcase data.

See [CONFIG_SCHEMA_MATRIX.md](CONFIG_SCHEMA_MATRIX.md) for paths, constraints, aliases, and overrides.

## Comment readiness and accepted Gitalk classification

- **FIRST-CLASS RUNTIME:** Waline 3.15.2 and Twikoo 2.0.8.
- **LEGACY RUNTIME:** Valine 1.5.3.
- **LEGACY IDENTITY / MIGRATION COMPATIBILITY ONLY:** Gitalk.

Twikoo/Waline Recent Comments use their public client APIs and a normalized, text-only model; Demo Recent Comments remain deterministic local fixtures. Gitalk UID/pathname identity helpers and Aurora 2 mapping documentation/tests remain. Upstream Gitalk 1.8 requires a browser-visible client secret for its OAuth/client flow; Aurora 3 intentionally does not expose that secret, bundle the Gitalk runtime, build an OAuth backend, or fork Gitalk. Canonical selection fails with a localized configuration error. Legacy Aurora 2 runtime fields are discarded with a migration warning.

This Gitalk limitation is **accepted product scope, not a Stable Preflight blocker**. Production backend availability and comment-record continuity for bundled providers remain unverified because no real service credentials or records were supplied; that is a separate site-specific deployment check, not evidence of a Gitalk runtime.

See [COMMENT_PROVIDER_MATRIX.md](COMMENT_PROVIDER_MATRIX.md) for role, runtime, identity, security, Recent Comments, and production-verification fields.

## Feeds and Pages topology

- Ordinary build routes: `/rss.xml`, `/cn/rss.xml`, `/sitemap.xml`, `/robots.txt`.
- Combined Pages docs base: `/astro-theme-aurora/`.
- Combined Pages Demo base: `/astro-theme-aurora/demo/`; all four Demo resources are nested under that base and must remain in `.pages-dist/demo/`.
- RSS is locale-filtered, static, and excludes drafts/hidden/private Demo items and entries explicitly marked `rss: false`.
- Sitemap lists canonical public routes; per-entry `sitemap: false` excludes that content URL. Compatibility aliases are not canonical sitemap entries.
- `robots.txt` advertises the absolute base-aware sitemap URL.

## Evidence labels

| Evidence | What it proves | What it does not prove |
| --- | --- | --- |
| Config unit tests | YAML parsing, defaults, strict validation, override precedence, aliases, security rejection | Every third-party consumer behavior without the UI smoke |
| Browser preflight with mocks | Rendered config propagation, provider option construction, local state/error paths, recent response handling | Real CDN uptime, provider server behavior, production credentials/records |
| Ordinary/Demo builds and XML parsing | Generated files, structure, locale filtering, canonical base composition | GitHub Pages deployment settings/live availability |
| `.pages-dist` assertions | Publishable combined artifact contains the routes at the right paths | Successful remote deployment or search-engine fetch |
| Existing migration fixtures | Legacy URL/hash/identity contracts encoded by fixtures | Production continuity for any user's actual provider database |

Do not call any production backend or live deployment verified without fresh external evidence. Version/tag identity remains `3.0.0-rc.2`; this task must not create a stable release, RC3, or move any RC tag. The `dev → main` PR must remain open and unmerged for independent review.

## Commands

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
pnpm test:browser:preflight
pnpm docs:build
pnpm test:docs
pnpm test:i18n
pnpm test:readme
pnpm demo:build
FEED_EXPECT_MODE=demo ASTRO_SITE=https://yanpuzhen.github.io ASTRO_BASE=/astro-theme-aurora/demo/ node scripts/verify-feeds.mjs
pnpm pages:build
pnpm test:pages
```

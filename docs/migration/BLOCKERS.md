# Migration blockers and accepted limitations

## Gitalk is migration-only (accepted scope; not a Stable Preflight blocker)

Aurora 3 retains Gitalk identity mapping and Aurora 2 migration recognition, but does not bundle a Gitalk browser runtime. Upstream Gitalk 1.8 requires a browser-visible client secret for its OAuth/client flow. Aurora intentionally does not expose that secret, build an OAuth backend, or fork Gitalk.

Canonical `comments.provider: gitalk` fails with localized configuration guidance recommending Waline or Twikoo. Legacy root Gitalk configuration never selects a runtime; only safe identity fields are retained, while credentials/runtime options are ignored or rejected without echoing values. Preserve UID/pathname mapping and test historical data against the old site when migrating.

This is an accepted provider classification, not an implementation blocker. Production backend verification is not applicable for Gitalk because no Gitalk runtime is provided. Site-specific continuity checks remain relevant for bundled providers and existing records.

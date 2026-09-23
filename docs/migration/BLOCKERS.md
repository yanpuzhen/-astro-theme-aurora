# Comment migration boundaries

Gitalk is removed from Aurora 3 runtime selection. Aurora 2 root `gitalk` settings only produce a warning and are discarded without reading values. Canonical `comments.provider: gitalk` fails with bilingual guidance to move GitHub-hosted comments to giscus. No browser OAuth secret, proxy, or fork is provided.

Existing Gitalk Issues can be converted to GitHub Discussions. The migration-only UID/pathname helper can identify historical keys, but converted Discussion titles and the chosen giscus mapping must be checked against real records. Aurora cannot promise continuity without those records. See `MIGRATION.md` and the bilingual Aurora 2 upgrade guides.

Production backend verification for giscus, Waline, Twikoo, and Valine remains site-specific. Local mocks establish client integration only.

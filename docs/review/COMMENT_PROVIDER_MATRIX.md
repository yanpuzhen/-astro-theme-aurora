# Comment Provider Capability Matrix

Aurora 3 first-class runtimes are giscus, Waline, and Twikoo. Valine remains a legacy runtime. Gitalk is removed from active provider selection; its historical Issue identity helper exists only under `src/lib/migration/` for migration checks.

| Provider | Role | Runtime | Identity / mapping | Recent Comments | Comment count | Production backend |
| --- | --- | --- | --- | --- | --- | --- |
| giscus | FIRST-CLASS | Official `@giscus/vue` 3.1.1 | GitHub Discussions; pathname by default, with url/title/og:title/specific/number options | No supported theme API | Not implemented | Not externally verified |
| Waline | FIRST-CLASS | Pinned 3.15.2 | Historical trailing-slash pathname | Supported | Not implemented | Not externally verified |
| Twikoo | FIRST-CLASS | Pinned 2.0.8 | Historical trailing-slash pathname | Supported | Not implemented | Not externally verified |
| Valine | LEGACY RUNTIME | Pinned 1.5.3 | Historical pathname without trailing slash | Not implemented | Not implemented | Not externally verified |
| Gitalk | REMOVED | None | Historical UID/pathname calculated only by migration helper | None | None | Not applicable |
| none | DISABLED | None | None | None | None | Not applicable |

The giscus Vue component mounts only for an enabled giscus island. It uses the giscus App/GitHub authorization flow and does not accept a site OAuth secret or PAT. Its iframe lives at giscus.app; Aurora does not render untrusted comment HTML into its own DOM. The Sidebar shows no fabricated Recent Comments when giscus is selected. The Demo uses local fixtures. Browser tests mock third-party assets and do not create a Discussion or verify production records.

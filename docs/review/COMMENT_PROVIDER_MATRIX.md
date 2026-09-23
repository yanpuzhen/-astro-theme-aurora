# Comment Provider Capability Matrix

Aurora 3 bundles runtime clients for Waline, Twikoo, and Valine only. Gitalk is retained solely as a legacy identity and migration-compatibility format. Its upstream 1.8 browser client requires a browser-visible OAuth client secret, so Aurora intentionally does not bundle or initialize it. This accepted scope is not a Stable Preflight blocker.

The browser preflight uses deterministic local mocks for bundled clients. It verifies adapter URLs, config props, identity rules, initialization options, loading/error states, and Recent Comments normalization. Mocks do not verify live CDNs, provider services, production credentials, or record continuity.

| Provider | Role | Runtime bundled | Identity compatibility | Secure OAuth runtime | Reason / client behavior | Recent Comments | Production backend verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gitalk | LEGACY IDENTITY / MIGRATION COMPATIBILITY | NO | YES — legacy UID by default; pathname mode remains available | NOT PROVIDED | Upstream browser client requires `clientSecret`; Aurora does not expose it and does not implement a backend or fork | NOT PROVIDED | NOT APPLICABLE |
| Valine | LEGACY RUNTIME | YES — pinned 1.5.3 | YES — historical pathname without trailing slash | NOT APPLICABLE | `https://unpkg.com/valine@1.5.3/dist/Valine.min.js`; `lang`; bundled CSS supports the scoped `.night` theme class | NOT PROVIDED by the theme | NOT EXTERNALLY VERIFIED; no production App ID/backend supplied |
| Twikoo | FIRST-CLASS RUNTIME | YES — pinned 2.0.8 | YES — historical pathname with trailing slash | NOT APPLICABLE | Self-hosted endpoint uses `twikoo.min.js`; CloudBase IDs use `twikoo.all.min.js`; init supports endpoint, region, path, and language | `getRecentComments` with endpoint/region/page size; normalized before rendering | NOT EXTERNALLY VERIFIED; no live Twikoo/CloudBase service supplied |
| Waline | FIRST-CLASS RUNTIME | YES — pinned 3.15.2 | YES — historical pathname with trailing slash | NOT APPLICABLE | Pinned module and required stylesheet; init supports server URL, locale, reactions, login, metadata, sorting, limits, and supported dark selector | `RecentComments({ serverURL, count })`; normalized before rendering | NOT EXTERNALLY VERIFIED; no live Waline server supplied |

For all bundled providers, scripts and required styles load only when selected, with duplicate loads coalesced; failures leave article content usable and show localized Aurora-owned status text. `none` loads no comment-provider assets. Valine/Twikoo/Waline settings that are public client values must not contain administrator/master credentials.

The Gitalk identity helpers and migration normalization remain covered by config and unit tests. Canonical `comments.provider: gitalk` is rejected with a localized explanation and Waline/Twikoo recommendations. Aurora 2 root-level Gitalk settings do not select a runtime; only the safe UID/pathname identity selector survives normalization, while credentials/runtime fields are discarded or rejected without echoing values.

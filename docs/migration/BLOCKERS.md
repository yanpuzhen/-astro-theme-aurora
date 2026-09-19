# Migration blockers and evidence

## Gitalk OAuth secret boundary (site configuration blocker)

Status: open only when the migrated site enables Gitalk.

The legacy component passes Gitalk's `clientSecret` to the browser-side constructor. ADR 005 requires that secrets never enter Astro page props. A static Astro page has no server-side OAuth proxy in this repository, so a production Gitalk deployment cannot both use the legacy constructor unchanged and satisfy the ADR.

Minimal resolution: configure a trusted OAuth/proxy endpoint outside the static site, or keep Gitalk disabled until such a proxy exists. The current island preserves UID/path identity and does not serialize a client secret; Valine, Twikoo and Waline use their public client settings when configured.

This does not block static content, routing, Pagefind, lightbox, Dia, or the other comment identity work. Existing provider records still require a real-site verification before release.

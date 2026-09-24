# Migrate from Gitalk

Aurora 3 has **no Gitalk runtime**. Upstream Gitalk expects a browser-side OAuth client secret model that Aurora does not expose. Existing Gitalk settings are migration input only. Gitalk stores comments as GitHub Issues; giscus uses GitHub Discussions. Neither changing `comments.provider` nor converting Issues guarantees that an old page will find the resulting Discussion.

1. Back up the old site and GitHub Issues. Inventory representative post URLs, titles, legacy UIDs and Issue titles before changing paths.
2. Enable Discussions in the target public repository and install the [giscus App](https://github.com/apps/giscus). Follow [giscus setup](/comments/giscus) to obtain public IDs.
3. Convert selected Issues to Discussions using GitHub's supported conversion action. Keep original records until the result is verified.
4. Choose a giscus mapping. `pathname` follows the deployed base and locale; `specific` with `term: "{legacyUid}"` expands Aurora's per-page ID. Converted Discussion titles must actually match the selected mapping. A literal term or global `number` can make all pages share one Discussion.
5. Deploy to a test address and inspect multiple old English/Chinese posts. Confirm the displayed Discussion, comment count and authors against real GitHub records before switching production traffic.

Aurora's route manifest helps compare canonical paths, aliases and IDs. It cannot import Issues or prove continuity without external records. See [From Aurora 2](/upgrade/from-aurora-2) for the broader migration.

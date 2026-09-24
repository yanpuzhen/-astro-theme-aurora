# giscus: GitHub Discussions

[giscus](https://giscus.app/) maps each page to a GitHub Discussion. Use a **public** GitHub repository with Discussions enabled, install the [giscus App](https://github.com/apps/giscus) for it, and choose a category that accepts new Discussions. The [configurator](https://giscus.app/) gives the public repository/category IDs; Aurora needs no GitHub PAT or OAuth client secret. Visitors authenticate through GitHub/giscus, and moderation happens in Discussions.

1. Complete the repository, App and category setup in the configurator.
2. Copy `repo`, `repo_id`, `category`, and `category_id` into `_config.yml`, then choose a mapping. `repo` and `repo_id` are required; `category_id` is required to create Discussions except with `number` mapping.
3. Build and open two distinct posts. Sign in as a visitor, submit a test comment, and confirm the intended Discussions were created. Check the Chinese route separately.

```yaml
comments:
  provider: giscus
  giscus:
    repo: example/blog-comments
    repo_id: R_example
    category: General
    category_id: DIC_example
    mapping: pathname
    strict: false
    reactions_enabled: true
    input_position: bottom
    theme: auto
    lang: auto
    loading: eager
```

Replace example IDs with the configurator's actual values. Additional supported settings are `term`, `emit_metadata`, and the options in [General Configuration](/configs/general). `theme: auto` follows Aurora's resolved light/dark theme; `lang: auto` follows the route. Aurora hydrates the island when visible.

## Choose a mapping deliberately

| Mapping | Discussion key |
| --- | --- |
| `pathname` (default) | Browser path, including deployment base and locale. |
| `url` | Full page URL; domain changes affect the key. |
| `title`, `og:title` | Page title or OpenGraph title; title edits may affect matching. |
| `specific` | `term`; use `term: "{legacyUid}"` for a per-page stable Aurora ID. |
| `number` | Positive Discussion number in `term`; the same global number on all pages shares one Discussion. |

With `pathname`, `/post/example/` and `/my-blog/post/example/` can map to different Discussions. `{legacyUid}` is expanded only for `specific` mapping; it does **not** automatically match Gitalk Issues or converted Discussions. A literal `specific` term shares a Discussion across pages. Before changing domain, base, permalink or strategy, compare real Discussion titles and test representative old posts. See [Gitalk migration](/comments/gitalk-migration).

The iframe is hosted by giscus/GitHub, outside Aurora's CSS and DOM. If your host enforces Content Security Policy, allow the origins required by the current [giscus integration](https://github.com/giscus/giscus) for its iframe and network requests; verify against your own policy rather than copying a generic directive list.

# Social Links

Author frontmatter accepts a normalized `socials` record for migration compatibility:

```yaml
author:
  name: Aurora Team
  link: https://example.com/team
  socials:
    github: https://github.com/yanpuzhen
```

The sidebar renders the author identity, avatar, description, and configured links. The Demo build supplies the explicit `Aurora Demo` profile with GitHub, Docs, and Issues destinations; ordinary builds use frontmatter/configuration and never inherit those fixtures.

Friend Links use the same static-first principle. The public Demo has seven categorized project/resource records. A normal build with no link dataset keeps the localized empty state rather than inventing external records. The component accepts `name`, `url`, `avatar`, `description`, `category`, and an optional display color.

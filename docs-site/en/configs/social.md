# Social Links

Configure site-level profile links in `_config.yml`:

```yaml
socials:
  - label: GitHub
    href: https://github.com/your-name
    icon: github # github | link
  - label: Email
    href: mailto:you@example.com
    icon: link
```

The sidebar uses these when the selected post's legacy author frontmatter does not provide social links. Existing author `socials` records remain migration-compatible; their custom HTML icons are not. Only HTTP(S), `mailto:`, and `tel:` URLs are accepted. The Demo profile is a separate deterministic fixture and does not inherit these site values.

Friend-link cards are configured separately in top-level `links`:

```yaml
links:
  - name: Example
    url: https://example.org
    avatar: /images/example.png
    description: A useful project
    category: Projects
    color: '#5433ff'
```

There can be up to 200 records. URLs must be absolute HTTP(S); avatar can be empty, a site-root path, or HTTP(S). The Demo has its own categorized fixture data. A normal build without `links` shows a localized empty state rather than fabricated records.

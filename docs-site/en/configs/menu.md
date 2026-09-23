# Menu

Configure the built-in route visibility with booleans in `_config.yml`; labels and targets are localized and owned by Aurora:

```yaml
menu:
  home: true
  tags: true
  categories: true
  archives: true
  about: true
  links: false
```

The same generated navigation is used by desktop and mobile layouts. These flags hide or show navigation links; they do not remove generated routes. Search remains available through the search UI and is not a menu flag. Friend-link data is configured separately in the top-level `links` array.

There is no runtime menu editor, arbitrary label/URL list, Vue Router, or Hexo menu runtime. Custom content pages are authored in `src/content/pages/`; their routing is governed by the static route implementation.

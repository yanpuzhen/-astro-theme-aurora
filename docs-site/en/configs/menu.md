# Menu

The menu is a typed list in `src/lib/config.ts`. Each item has a `label` and an `href`:

```ts
menu: [
  { label: 'Home', href: '/' },
  { label: 'Tags', href: '/tags/' },
  { label: 'Docs', href: 'https://yanpuzhen.github.io/-astro-theme-aurora/' },
]
```

Relative links are composed with Astro's configured `base`. Absolute `https://` links are kept external. Existing site routes include the home page, tags, archives, about, search, categories, and custom pages.

The same menu is passed to the mobile menu island. On small viewports the desktop links are hidden after JavaScript marks the document as enhanced; with JavaScript disabled, the ordinary navigation remains visible and usable.

There is no runtime menu editor, Vue Router, or arbitrary Hexo menu schema in Aurora 3 RC. Menu entries that need a custom page must point to a generated entry in `src/content/pages/`.

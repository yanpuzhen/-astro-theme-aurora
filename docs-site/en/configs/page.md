# Pages & Navigation

Markdown files in `src/content/pages/` are the source for custom pages. `about.md` is rendered at `/about/`; other entries are rendered at `/page/<id>/` and can be linked from the menu.

Taxonomy and archive pages are generated from public posts:

- `/tags/` and `/tags/<slug>/`
- `/categories/` and `/categories/<slug>/`
- `/archives/` and paginated archive pages
- `/search/`

Custom page navigation is explicit: add a menu item pointing to the generated path. There is no author-page route in the current Aurora 3 RC, and the old page-sidebar schema is not currently supported.

Pages use the same static layout, metadata, base-path helpers, Markdown pipeline, and no-JavaScript readability guarantees as posts.

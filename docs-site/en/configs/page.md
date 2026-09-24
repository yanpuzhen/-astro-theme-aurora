# Pages & Navigation

Markdown files in `src/content/pages/` are the source for custom pages. `about.md` is rendered at `/about/`; other entries are rendered at `/page/<id>/` and can be linked from Markdown or another navigation surface. The built-in `menu` flags do not add custom page entries.

Taxonomy and archive pages are generated from public posts:

- `/tags/` and `/tags/<slug>/`
- `/categories/` and `/categories/<slug>/`
- `/archives/` and paginated archive pages
- `/search/`

Custom page navigation is explicit: link the generated path from content or another navigation surface. Aurora 3.0 has no author-page route, and the old page-sidebar schema is not supported.

Pages use the same static layout, metadata, base-path helpers, Markdown pipeline, and no-JavaScript readability guarantees as posts.

Pages use the same required `title` and `date` frontmatter as posts. See [Writing Posts & Pages](/guide/writing-content) and [Frontmatter](/reference/frontmatter).

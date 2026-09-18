# Aurora 3.0 dependency decisions

| Dependency | Decision | Rationale / replacement |
|---|---|---|
| `vue` | KEEP | Astro Vue integration for focused islands only. |
| `vue-router` | REMOVE | Astro owns all routes; browser navigation uses generated links. |
| `pinia` | REMOVE | No shared client state is needed after build-time data; islands own local state. |
| `axios` | REMOVE | Content is collection data; comment/search SDKs use their own adapters/fetch only. |
| `vue-i18n` | REPLACE | Build-time dictionaries for static labels; a small island/local dictionary for interactive controls if needed. |
| `js-cookie` | REPLACE | Prefer `localStorage` with guarded browser access for theme preference, or a small cookie helper only where SSR-visible preference is required. |
| `nprogress` | REMOVE | Static navigation does not need route loading; use native transitions/CSS if a future island needs feedback. |
| `vue3-click-away` | REMOVE | Use Vue event listeners or native focus/click handling inside the island. |
| `vue3-lazyload` | REMOVE | Use native `loading="lazy"`, responsive images, and Astro assets. |
| `vue-easy-lightbox` | REPLACE | Keep the behavior as a small Vue lightbox island; reassess a dependency-free dialog before adding a new package. |
| `vue3-scroll-spy` | REMOVE | Use CSS `scroll-margin`, native anchors, and an optional small IntersectionObserver island. |
| `vite-plugin-pages` | REMOVE | Astro filesystem routing replaces generated Vue routes. |
| `vite-plugin-svg-icons` | REPLACE | Use Astro/Vite asset imports or inline accessible SVG; keep the existing icon files where practical. |
| `astro` | ADD | Static site generator, content collections, routing and head generation. |
| `@astrojs/vue` | ADD | Vue islands only. |
| `zod` | ADD (via Astro content tooling) | Typed, validated frontmatter compatibility schema. |
| Shiki / Astro Markdown integrations | KEEP/ADAPT | Build-time highlighting replaces Hexo's deasync renderer. |
| Pagefind | ADD | Static search index; validate Chinese corpus before locking the fallback. |

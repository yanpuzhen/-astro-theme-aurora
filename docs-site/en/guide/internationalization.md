# Internationalization

Aurora 3.0 supports English (`en`) and Simplified Chinese (`zh-CN`) as build-time locales. The URL is the source of truth: the default English locale is unprefixed and Chinese uses `/cn/`.

## Content fields

`lang` and `translationKey` are optional frontmatter fields:

```yaml
lang: zh-CN
translationKey: welcome-aurora-3
```

Legacy content without `lang` remains English. A matching `translationKey` pairs entries for the language switcher, SEO alternates, and locale-specific search. It does not replace the legacy UID, slug, permalink, title hash, or comment identity.

## Routes and switching

English keeps existing routes such as `/`, `/archives/`, and `/post/example/`. Chinese mirrors the same sections below `/cn/`, for example `/cn/archives/` and `/cn/post/example/`. The switcher links to a real translation when one exists; otherwise it links to the equivalent locale section or locale home and never invents an article URL.

There is no browser-language, IP, or `Accept-Language` redirect. Static HTML is generated for every supported locale, so the route is known before hydration. The same composition works for `/`, `/aurora/`, `/blog/theme/`, and the Pages Demo base `/astro-theme-aurora/demo/`.

## SEO and feeds

Each page self-canonicalizes and emits `lang="en"` or `lang="zh-CN"`. Paired pages emit only existing `en`, `zh-CN`, and `x-default` alternates. OpenGraph uses `en_US` and `zh_CN`. The sitemap includes both locale route families. `/rss.xml` is the English feed and `/cn/rss.xml` is the Chinese feed.

## Search and comments

Pagefind generates separate `en` and `zh-cn` indexes. Each search island receives its locale explicitly and does not merge the other language index. Result URLs therefore remain inside the current base and locale.

Translated articles receive independent comment identities by default. An English article retains its legacy identity; a Chinese translation gets a locale-scoped identity. For Gitalk → giscus migration, compare historical UID/pathname keys with converted Discussions; Aurora 3 has no Gitalk runtime. Continuity for Valine, Twikoo, or Waline still requires checking that provider's external records.

## Adding a translation

1. Copy the source post and translate its visible content.
2. Set `lang` to `en` or `zh-CN` and use the same `translationKey`.
3. Keep the translated entry's slug, permalink, and title intentional; do not copy an identity field merely to pair content.
4. Run `pnpm check`, `pnpm build`, and the browser locale tests before publishing.

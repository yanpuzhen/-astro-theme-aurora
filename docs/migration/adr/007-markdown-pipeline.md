# ADR 007: One Astro Markdown pipeline replaces Hexo post-render mutation

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

Astro's Markdown/MDX pipeline is the only renderer. Remark/rehype plugins implement Aurora containers, blockquote decoration, TOC hooks and safe raw HTML; Shiki provides build-time highlighting. Scripts in Markdown are inert/removed by default, with explicit trusted components for embeds.

## Context

Hexo currently combines its renderer with an after-render regex filter and a synchronous deasync Shiki integration, then injects HTML with Vue `v-html`.

## Consequences

Legacy syntax requires fixtures and a deliberate compatibility plugin. Arbitrary scripts no longer execute silently, which is a documented breaking difference.

# ADR 002: Typed collection model with compatibility normalization

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

Astro Content Collections with Zod define posts/pages. A normalization adapter accepts legacy scalar or array tags/categories, author keys or objects, `comment/comments`, `sticky/pinned`, and legacy UID fields. Unknown fields are retained temporarily in `extras` and removed only after fixture coverage.

## Context

The plugin maps Hexo objects dynamically and supports more fields than its TypeScript client models expose. Requiring hand edits would break the preservation goal.

## Consequences

Build failures identify invalid content early. The adapter is the only compatibility boundary; templates consume normalized types rather than Hexo-shaped objects.

# ADR 003: Preserve verified URLs and comment keys through a route manifest

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

The migration records canonical path, historical aliases, legacy UID and comment identity per entry. `/post/<slug>/`, UID mode, explicit permalinks and verified `.html` forms are supported. Unrepresentable old paths become static redirects. No silent provider key change is allowed.

## Context

The mapper uses `site.pathSlug` and a title hash; the Vue clients and comment providers use both UID and pathname. A slug-only rewrite can orphan existing comments.

## Consequences

A fixture/manifest audit is required before changing titles or slugs. Redirects are static and observable; they do not reintroduce a runtime router.

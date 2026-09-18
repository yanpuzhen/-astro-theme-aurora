# ADR 001: Astro owns canonical routing

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

Astro filesystem routes and one typed `resolvePostPath` layer own all public URLs. Vue Router, runtime route guards, and JSON route aliases are removed from the canonical site. The resolver supports slug, UID, explicit permalink, and a legacy `.html` compatibility mode without implementing a general Hexo permalink DSL.

## Context

The legacy site chains Hexo routes, plugin-generated JSON paths, and Vue Router paths. That creates duplicate ownership and makes base paths and comment identifiers drift.

## Consequences

Static links, canonical metadata, redirects, comments, pagination and cards consume one route manifest. A route change is a migration decision and must update the manifest/tests. Unsupported historical patterns require static redirects.

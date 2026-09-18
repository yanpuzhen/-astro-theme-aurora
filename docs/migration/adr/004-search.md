# ADR 004: Pagefind is the default static search index

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

Index generated HTML with Pagefind and put only the search interaction in a Vue island. Validate Chinese tokenization and ranking with a fixture corpus; use MiniSearch only if Pagefind quality is inadequate. Do not preserve the full legacy search JSON API.

## Context

The legacy search endpoint ships post bodies and forces runtime Axios fetching. Static HTML already contains the searchable content.

## Consequences

Search is compatible with static hosting and has a bounded client payload. Build and corpus tests become part of the migration.

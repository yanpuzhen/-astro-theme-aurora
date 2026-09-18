# ADR 005: Comment providers receive stable identity aliases

- **Status:** ACCEPTED
- **Date:** 2026-09-19

## Decision

A comment island receives a stable legacy UID, canonical path and verified historical aliases. Gitalk defaults to the legacy UID and may use a verified pathname alias; Valine, Twikoo and Waline preserve their historical pathname semantics. Provider adapters remain isolated and secrets never enter page props.

## Context

`Comment.vue` supports Gitalk, Valine, Twikoo and Waline, each with different identity rules. Existing comments are migration-critical.

## Consequences

The implementation must collect real provider keys and test representative entries before changing routes. A comment migration map is required for changed paths.

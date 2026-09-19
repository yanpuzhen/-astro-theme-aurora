# Aurora 3.0 RC1 release checklist

This checklist is evidence-driven. Check an item only after the command or inspection has completed for the final RC1 commit.

## Repository and history

- [x] Working tree was clean before release changes.
- [x] `origin` targets `https://github.com/yanpuzhen/-astro-theme-aurora.git`.
- [x] Existing remote bootstrap history is preserved; no force push, rebase, squash, or amend was used.
- [x] Current branch is `main`.
- [x] Target repository visibility and default branch are verified.

## Source and packaging

- [x] Repository links, issue links, homepage, and clone instructions point to `yanpuzhen/-astro-theme-aurora`.
- [x] Upstream Aurora attribution and license are preserved.
- [x] `package.json` metadata and README requirements agree.
- [x] `.env.example` documents every public build-time configuration value without real credentials.
- [x] `.gitignore` excludes dependencies, generated output, caches, reports, and environment files.
- [x] No real secret, credential, unnecessary personal information, or local machine path is present.
- [x] `pnpm pack` contents were inspected if the package layout is audited.

## Documentation and CI

- [x] README has a tested Quick Start.
- [x] MIGRATION.md covers compatibility, manual migration, changed behavior, deprecated behavior, and removed behavior.
- [x] CHANGELOG and GitHub RC notes are ready.
- [x] CONTRIBUTING.md documents the supported development commands.
- [x] GitHub Actions runs frozen install, test, check, and build on push and pull request.

## Clean install and reproducibility

- [x] Fresh clone equivalent uses `pnpm install --frozen-lockfile`.
- [x] Dependency build scripts are explicitly allowlisted in `pnpm-workspace.yaml`.
- [x] Generated `dist`, `.astro`, Pagefind output, browser output, and caches were removed before the final build.
- [x] `pnpm test` passed.
- [x] `pnpm check` passed.
- [x] Root `pnpm build` passed and generated Pagefind.
- [x] `/aurora/` build passed.
- [x] `/blog/theme/` build passed.

## Runtime and compatibility

- [x] Root browser suite passed 5/5.
- [x] Nested-base browser suite passed 5/5 under `/aurora/`.
- [x] CSS, JS, images, Pagefind, navigation, canonical URLs, and islands use the configured base.
- [x] Home, post, tags, categories, archives, pagination, and navigation are readable without JavaScript.
- [x] Browser console errors, hydration errors, missing assets, and Pagefind errors were reviewed; six `/blog/theme/` routes had no failures.
- [x] Legacy frontmatter, permalink, UID, title hash, comment aliases, and base-path behavior are documented.
- [x] Known limitations describe only unresolved, evidenced limitations.

## Version and publication

- [x] Version is `3.0.0-rc.1` in `package.json` and release metadata.
- [x] Final regression passed after the version change.
- [x] Final RC1 commit was created without rewriting migration history.
- [x] Working tree is clean.
- [x] `main` was pushed and matched the final RC1 commit `3caec65` at publication; `origin/main` is now `3918f79` after the CI-only runner correction.
- [x] Annotated tag `v3.0.0-rc.1` points to final RC1 commit `3caec65` and was pushed.
- [x] GitHub Release `Aurora 3.0.0 RC1` was created from that tag as a prerelease.
- [x] Repository, branch, tag, release, and commit were verified after publication.

## Publication record

The published RC1 tag and prerelease remain immutable at `3caec65`. Follow-up commit `3918f79` only changes the CI runner from Node 20 to Node 22, matching pnpm `11.19.0`; its GitHub Actions run passed and it is now the head of `main`.

# Aurora 3.0 RC1 release checklist

This checklist is evidence-driven. Check an item only after the command or inspection has completed for the final RC1 commit.

## Repository and history

- [ ] Working tree was clean before release changes.
- [ ] `origin` targets `https://github.com/yanpuzhen/-astro-theme-aurora.git`.
- [ ] Existing remote bootstrap history is preserved; no force push, rebase, squash, or amend was used.
- [ ] Current branch is `main`.
- [ ] Target repository visibility and default branch are verified.

## Source and packaging

- [ ] Repository links, issue links, homepage, and clone instructions point to `yanpuzhen/-astro-theme-aurora`.
- [ ] Upstream Aurora attribution and license are preserved.
- [ ] `package.json` metadata and README requirements agree.
- [ ] `.env.example` documents every public build-time configuration value without real credentials.
- [ ] `.gitignore` excludes dependencies, generated output, caches, reports, and environment files.
- [ ] No real secret, credential, unnecessary personal information, or local machine path is present.
- [ ] `pnpm pack` contents were inspected if the package layout is audited.

## Documentation and CI

- [ ] README has a tested Quick Start.
- [ ] MIGRATION.md covers compatibility, manual migration, changed behavior, deprecated behavior, and removed behavior.
- [ ] CHANGELOG and GitHub RC notes are ready.
- [ ] CONTRIBUTING.md documents the supported development commands.
- [ ] GitHub Actions runs frozen install, test, check, and build on push and pull request.

## Clean install and reproducibility

- [ ] Fresh clone equivalent uses `pnpm install --frozen-lockfile`.
- [ ] Generated `dist`, `.astro`, Pagefind output, browser output, and caches were removed before the final build.
- [ ] `pnpm test` passed.
- [ ] `pnpm check` passed.
- [ ] Root `pnpm build` passed and generated Pagefind.
- [ ] `/aurora/` build passed.
- [ ] `/blog/theme/` build passed.

## Runtime and compatibility

- [ ] Root browser suite passed with its actual test count.
- [ ] Nested-base browser suite passed with its actual test count.
- [ ] CSS, JS, images, Pagefind, navigation, canonical URLs, and islands use the configured base.
- [ ] Home, post, tags, categories, archives, pagination, and navigation are readable without JavaScript.
- [ ] Browser console errors, hydration errors, missing assets, and Pagefind errors were reviewed.
- [ ] Legacy frontmatter, permalink, UID, title hash, comment aliases, and base-path behavior are documented.
- [ ] Known limitations describe only unresolved, evidenced limitations.

## Version and publication

- [ ] Version is `3.0.0-rc.1` in `package.json` and release metadata.
- [ ] Final regression passed after the version change.
- [ ] Final RC1 commit was created without rewriting migration history.
- [ ] Working tree is clean.
- [ ] `main` was pushed and remote `origin/main` matches the final RC1 commit.
- [ ] Annotated tag `v3.0.0-rc.1` points to the final RC1 commit and was pushed.
- [ ] GitHub Release `Aurora 3.0.0 RC1` was created from that tag as a prerelease.
- [ ] Repository, branch, tag, release, and commit were verified after publication.

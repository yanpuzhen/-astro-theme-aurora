# Contributing to Aurora 3.0

Aurora is an Astro static theme with focused Vue islands. Keep changes compatible with the documented route, content, and comment-identity contracts.

## Development setup

Use the supported Node.js and pnpm versions from [README.md](README.md), then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Before opening a pull request, run:

```sh
pnpm test
pnpm check
pnpm build
pnpm run test:browser
```

If a change affects URL composition or static output, also test `ASTRO_BASE=/aurora/` and `ASTRO_BASE=/blog/theme/`. If it affects browser behavior, include the relevant root and nested-base browser result.

## Pull requests

- Keep the frozen Astro/static architecture intact; do not introduce a SPA router or runtime article API.
- Preserve legacy paths, UID/title-hash behavior, provider-specific comment identity, and base-path links unless the change includes compatibility evidence and documentation.
- Do not commit `.env` files, credentials, generated output, screenshots, or local machine paths.
- Update migration or release documentation when user-visible behavior changes.
- Keep commits focused and explain security or compatibility trade-offs in the pull request description.

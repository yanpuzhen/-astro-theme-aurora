# Theme

Aurora has three effective appearance states: light, dark, and the system preference fallback. The inline head script selects the system preference on first load; the Theme island persists an explicit choice in `localStorage` under `aurora-theme`.

The current theme defaults are defined in `src/lib/config.ts`:

```ts
theme: {
  feature: true,
  darkMode: true,
  profileShape: 'diamond',
  colors: ['#24c6dc', '#5433ff', '#ff0099'],
}
```

`darkMode` and `profileShape` are part of the typed config surface, while the current public shell exposes the light/dark toggle and the Aurora gradient system. The toggle is an enhancement; generated content and navigation remain readable without it.

Responsive layouts cover the home grid, article body, taxonomy cards, archives, search, and mobile navigation. Theme choice is local to the browser and is not sent to a server.

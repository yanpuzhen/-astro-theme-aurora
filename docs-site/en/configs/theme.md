# Theme

Set supported theme values in the root `_config.yml`:

```yaml
theme:
  feature: true
  dark_mode: true # initial appearance; visitors may switch and persist their choice
  profile_shape: diamond # circle | diamond | rounded
  gradient:
    color_1: '#24c6dc'
    color_2: '#5433ff'
    color_3: '#ff0099'
```

`feature` controls the existing home post-selection mode. `dark_mode` selects the initial appearance; the visitor's explicit local choice takes precedence and is stored in the browser. `profile_shape` applies to the sidebar and footer avatars. The three hex values feed the Aurora gradient CSS variables.

The appearance toggle is an enhancement; static content and navigation remain readable without JavaScript. Theme choice stays local to the browser and is not sent to a server.

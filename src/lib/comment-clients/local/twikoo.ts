// Twikoo's npm entry point is UMD and its ESM default resolves to init only.
// Vite emits the official distribution as a hashed same-origin script asset.
import scriptUrl from '../../../../node_modules/twikoo/dist/twikoo.min.js?url'

export { scriptUrl }

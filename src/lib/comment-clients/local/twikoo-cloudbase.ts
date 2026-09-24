// Twikoo exports only its slim entry point; its official CloudBase build is a
// package file, so Vite emits it as a hashed same-origin asset.
import cloudBaseUrl from '../../../../node_modules/twikoo/dist/twikoo.all.min.js?url'

export { cloudBaseUrl }

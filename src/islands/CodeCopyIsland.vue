<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const cleanups: (() => void)[] = []

onMounted(() => {
  for (const pre of document.querySelectorAll<HTMLPreElement>('.post-html pre')) {
    if (pre.querySelector('.code-copy-button')) continue
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.title = 'Copy code'
    button.setAttribute('aria-label', 'Copy code')
    button.textContent = 'Copy'
    const handler = async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || '')
        button.textContent = 'Copied'
        window.setTimeout(() => { button.textContent = 'Copy' }, 1400)
      } catch {
        button.textContent = 'Unavailable'
      }
    }
    button.addEventListener('click', handler)
    pre.append(button)
    cleanups.push(() => button.removeEventListener('click', handler))
  }
})

onUnmounted(() => cleanups.forEach((cleanup) => cleanup()))
</script>

<template><span class="code-copy-island" aria-hidden="true"></span></template>

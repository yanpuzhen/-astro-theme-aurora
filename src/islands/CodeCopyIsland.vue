<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { AuroraMessages } from '../lib/i18n'

const props = defineProps<{ messages: Pick<AuroraMessages, 'copy' | 'copied' | 'unavailable'> }>()
const cleanups: (() => void)[] = []

onMounted(() => {
  for (const pre of document.querySelectorAll<HTMLPreElement>('.post-html pre')) {
    if (pre.querySelector('.code-copy-button')) continue
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.title = props.messages.copy
    button.setAttribute('aria-label', props.messages.copy)
    button.textContent = props.messages.copy
    const handler = async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || '')
        button.textContent = props.messages.copied
        window.setTimeout(() => { button.textContent = props.messages.copy }, 1400)
      } catch {
        button.textContent = props.messages.unavailable
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

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Giscus from '@giscus/vue'
import type { AuroraConfigValue } from '../lib/config-schema'

const props = defineProps<{
  settings: Readonly<AuroraConfigValue['comments']['giscus']>
  legacyUid: string
  locale: 'en' | 'zh-CN'
  loadingText: string
  errorText: string
}>()
const host = ref<HTMLElement>()
const status = ref(props.loadingText)
const isDark = ref(false)
const theme = computed(() => props.settings.theme === 'auto'
  ? isDark.value ? 'dark' : 'light'
  : props.settings.theme)
const lang = computed(() => props.settings.lang === 'auto' ? props.locale : props.settings.lang)
const repo = computed(() => props.settings.repo as `${string}/${string}`)
const term = computed(() => props.settings.mapping === 'specific' && props.settings.term === '{legacyUid}'
  ? props.legacyUid : props.settings.term)
let themeObserver: MutationObserver | undefined
let systemTheme: MediaQueryList | undefined
let timeout: number | undefined

function syncTheme() {
  const choice = document.documentElement.dataset.theme
  isDark.value = choice === 'dark' || (choice !== 'light' && Boolean(systemTheme?.matches))
}

// The official Vue wrapper mounts the official web component. Updating its
// reflected attribute also covers wrapper versions that do not forward a later
// prop change to an already upgraded custom element.
watch(theme, (next) => {
  host.value?.querySelector('giscus-widget')?.setAttribute('theme', next)
})

function onGiscusMessage(event: MessageEvent) {
  if (event.origin !== 'https://giscus.app') return
  const iframe = host.value?.querySelector('giscus-widget')?.shadowRoot?.querySelector('iframe')
  if (!iframe || event.source !== iframe.contentWindow) return
  const message = event.data?.giscus
  if (!message || typeof message !== 'object') return
  if (typeof message.error === 'string' && !message.error.includes('Discussion not found')) {
    // The official widget owns post-load errors and login state. Aurora keeps
    // its own status for initial loading only, without masking that UI.
    if (status.value) status.value = props.errorText
    if (timeout) window.clearTimeout(timeout)
  } else if (typeof message.resizeHeight === 'number' && message.resizeHeight > 0) {
    status.value = ''
    if (timeout) window.clearTimeout(timeout)
  }
}

onMounted(() => {
  systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  systemTheme.addEventListener('change', syncTheme)

  // A loaded iframe can still be Chrome's network-error page. Wait for an
  // authenticated-by-origin giscus message rather than the iframe load event.
  window.addEventListener('message', onGiscusMessage)
  timeout = window.setTimeout(() => {
    if (status.value) status.value = props.errorText
  }, 15000)
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  systemTheme?.removeEventListener('change', syncTheme)
  window.removeEventListener('message', onGiscusMessage)
  if (timeout) window.clearTimeout(timeout)
})
</script>

<template>
  <div ref="host" class="giscus-comment-host">
    <p v-if="status" class="comment-status" role="status">{{ status }}</p>
    <Giscus
      :repo="repo"
      :repo-id="settings.repoId"
      :category="settings.category || undefined"
      :category-id="settings.categoryId || undefined"
      :mapping="settings.mapping"
      :term="term || undefined"
      :strict="settings.strict ? '1' : '0'"
      :reactions-enabled="settings.reactionsEnabled ? '1' : '0'"
      :emit-metadata="settings.emitMetadata ? '1' : '0'"
      :input-position="settings.inputPosition"
      :theme="theme"
      :lang="lang"
      :loading="settings.loading"
    />
  </div>
</template>

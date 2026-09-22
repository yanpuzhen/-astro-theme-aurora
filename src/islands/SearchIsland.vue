<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AuroraMessages, AuroraLocale } from '../lib/i18n'

interface Props { base: string; overlay?: boolean; searchHref?: string; locale?: AuroraLocale; messages: AuroraMessages }
interface SearchResult { url: string; title: string; excerpt: string }
interface PagefindResult { score: number; data: () => Promise<SearchResult> }
interface PagefindSearchResponse { results: PagefindResult[] }
interface PagefindModule {
  mergeIndex: (path: string, options: { language: string; baseUrl: string }) => Promise<void>
  search: (value: string) => Promise<PagefindSearchResponse>
}
const props = withDefaults(defineProps<Props>(), { overlay: false, searchHref: '/search/', locale: 'en' })
const open = ref(!props.overlay)
const searchInput = ref<HTMLInputElement>()
const query = ref('')
const results = ref<SearchResult[]>([])
const loading = ref(false)
const error = ref('')
let pagefindLoading: Promise<PagefindModule> | undefined
let searchId = 0
let previousBodyOverflow = ''

function lockBody() {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function unlockBody() {
  document.body.style.overflow = previousBodyOverflow
}

async function openSearch() {
  open.value = true
  lockBody()
  await nextTick()
  searchInput.value?.focus()
}

function closeSearch() {
  if (props.overlay) {
    open.value = false
    unlockBody()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeSearch()
}

onMounted(() => {
  if (props.overlay) document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  unlockBody()
})

function pagefindBasePath() {
  return `${props.base.replace(/\/$/, '')}/pagefind/` || '/pagefind/'
}

async function loadIndexes() {
  if (pagefindLoading) return pagefindLoading

  pagefindLoading = (async () => {
    const basePath = pagefindBasePath()
    const entryUrl = new URL(`${basePath}pagefind-entry.json`, window.location.origin)
    const entryResponse = await fetch(entryUrl)
    if (!entryResponse.ok) throw new Error(`Pagefind metadata request failed: ${entryResponse.status}`)
    const entry = await entryResponse.json() as { languages?: Record<string, { page_count?: number }> }
    const languageInfo = entry.languages || {}
    const languages = Object.keys(languageInfo)
    if (languages.length === 0) throw new Error('Pagefind did not publish any language indexes.')

    const pagefindUrl = new URL(`${basePath}pagefind.js`, window.location.origin).href
    const index = await import(/* @vite-ignore */ pagefindUrl) as PagefindModule
    const requestedLanguage = document.documentElement.lang.toLowerCase()
    const wanted = props.locale.toLowerCase()
    const selected = languages.find((language) => language === wanted)
      || languages.find((language) => language.split('-')[0] === wanted.split('-')[0])
    if (!selected) throw new Error(`Pagefind index is missing locale ${props.locale}.`)
    // pagefind.js selects the index from <html lang>. Do not merge the other
    // locale: search results must remain inside the current language section.
    return index
  })()

  try {
    return await pagefindLoading
  } catch (loadError) {
    pagefindLoading = undefined
    throw loadError
  }
}

async function search() {
  const value = query.value.trim()
  const currentSearchId = ++searchId
  if (!value) { results.value = []; error.value = ''; return }
  loading.value = true; error.value = ''
  try {
    const index = await loadIndexes()
    const response = await index.search(value)
    if (currentSearchId !== searchId) return
    const matches = response.results
      .sort((left, right) => right.score - left.score)
      .slice(0, 10)
    const nextResults = await Promise.all(matches.map((result) => result.data()))
    if (currentSearchId !== searchId) return
    results.value = nextResults
  } catch {
    if (currentSearchId !== searchId) return
    error.value = props.messages.searchUnavailable
    results.value = []
  } finally {
    if (currentSearchId === searchId) loading.value = false
  }
}
</script>

<template>
  <a v-if="props.overlay" data-dia="search" class="header-control header-search-trigger" :href="props.searchHref" :aria-label="props.messages.openSearch" @click.prevent="openSearch">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="m16 16 5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /></svg>
  </a>
  <div v-if="!props.overlay || open" :class="{ 'search-modal': props.overlay }" :aria-hidden="props.overlay && !open" :role="props.overlay ? 'dialog' : undefined" :aria-modal="props.overlay ? 'true' : undefined" :aria-label="props.messages.search" @click.self="closeSearch">
    <div class="search-island search-container" @click.stop>
      <form class="search-form" @submit.prevent>
        <label class="sr-only" for="search-input">{{ props.messages.search }}</label>
        <input id="search-input" ref="searchInput" v-model="query" class="search-input search-box" type="search" autocomplete="off" :placeholder="props.messages.searchPlaceholder" :aria-label="props.messages.search" @input="search" />
        <button v-if="query" class="search-btn" type="button" :aria-label="props.messages.clearSearch" @click="query = ''; results = []; error = ''"><span aria-hidden="true">×</span></button>
        <button class="search-btn" type="submit" :aria-label="props.messages.search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="m16 16 5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /></svg></button>
      </form>
      <p v-if="!query && !loading" class="search-startscreen">{{ props.messages.searchStart }}</p>
      <p v-if="loading" class="search-state">{{ props.messages.searching }}</p><p v-else-if="error" class="search-state">{{ error }}</p>
      <div class="search-results" aria-live="polite">
        <a v-for="result in results" :key="result.url" class="search-result" :href="result.url">
          <div class="search-hit-container"><span class="search-hit-icon">›</span><span class="search-hit-content-wrapper"><strong class="search-hit-title">{{ result.title }}</strong><span class="search-hit-path" v-html="result.excerpt"></span></span><span class="search-hit-action">→</span></div>
        </a>
        <p v-if="query && !loading && !error && results.length === 0" class="search-state">{{ props.messages.noResults }}</p>
      </div>
      <footer class="search-footer"><span>{{ props.messages.pagefindIndex }}</span><span>{{ props.messages.typeToSearch }}</span></footer>
    </div>
  </div>
</template>

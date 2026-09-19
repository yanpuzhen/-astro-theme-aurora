<script setup lang="ts">
import { ref } from 'vue'

interface Props { base: string }
interface SearchResult { url: string; title: string; excerpt: string }
interface PagefindResult { score: number; data: () => Promise<SearchResult> }
interface PagefindSearchResponse { results: PagefindResult[] }
interface PagefindModule {
  mergeIndex: (path: string, options: { language: string; baseUrl: string }) => Promise<void>
  search: (value: string) => Promise<PagefindSearchResponse>
}
const props = defineProps<Props>()
const query = ref('')
const results = ref<SearchResult[]>([])
const loading = ref(false)
const error = ref('')
let pagefindLoading: Promise<PagefindModule> | undefined
let searchId = 0

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
    const primaryLanguage = languages.find((language) => language === requestedLanguage)
      || languages.find((language) => language.split('-')[0] === requestedLanguage.split('-')[0])
      || [...languages].sort((left, right) => (languageInfo[right].page_count || 0) - (languageInfo[left].page_count || 0))[0]
    // Pagefind skips merging when the path is exactly its primary base path.
    // The equivalent dot path keeps the same static files while selecting a second language.
    const mergeBasePath = `${basePath}./`
    await Promise.all(languages
      .filter((language) => language !== primaryLanguage && language.split('-')[0] !== primaryLanguage)
      .map((language) => index.mergeIndex(mergeBasePath, { language, baseUrl: props.base || '/' })))
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
    error.value = 'The search index is unavailable in this build.'
    results.value = []
  } finally {
    if (currentSearchId === searchId) loading.value = false
  }
}
</script>

<template>
  <div class="search-island">
    <input v-model="query" class="search-box" type="search" placeholder="Search Aurora…" aria-label="Search" @input="search" />
    <p v-if="loading">Searching…</p><p v-else-if="error">{{ error }}</p>
    <div class="search-results" aria-live="polite">
      <a v-for="result in results" :key="result.url" class="search-result" :href="result.url">
        <h2>{{ result.title }}</h2><p v-html="result.excerpt"></p>
      </a>
      <p v-if="query && !loading && !error && results.length === 0">No results.</p>
    </div>
  </div>
</template>

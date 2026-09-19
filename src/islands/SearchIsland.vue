<script setup lang="ts">
import { ref } from 'vue'

interface Props { base: string }
interface SearchResult { url: string; title: string; excerpt: string }
const props = defineProps<Props>()
const query = ref('')
const results = ref<SearchResult[]>([])
const loading = ref(false)
const error = ref('')
let pagefind: { search: (value: string) => Promise<{ results: { data: () => Promise<SearchResult> }[] }> } | undefined

async function loadIndex() {
  if (pagefind) return pagefind
  const url = new URL(`${props.base.replace(/\/$/, '')}/pagefind/pagefind.js`, window.location.origin).href
  pagefind = await import(/* @vite-ignore */ url) as typeof pagefind
  return pagefind
}

async function search() {
  const value = query.value.trim()
  if (!value) { results.value = []; error.value = ''; return }
  loading.value = true; error.value = ''
  try {
    const index = await loadIndex()
    const response = await index!.search(value)
    results.value = await Promise.all(response.results.slice(0, 10).map((result) => result.data()))
  } catch {
    error.value = 'The search index is unavailable in this build.'
    results.value = []
  } finally { loading.value = false }
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

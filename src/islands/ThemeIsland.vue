<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Theme = 'light' | 'dark'
const theme = ref<Theme>('light')

function currentTheme(): Theme {
  const value = document.documentElement.dataset.theme
  return value === 'dark' || value === 'light'
    ? value
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function setTheme(next: Theme, persist = true) {
  theme.value = next
  document.documentElement.dataset.theme = next
  if (persist) localStorage.setItem('aurora-theme', next)
}

function toggle() { setTheme(theme.value === 'dark' ? 'light' : 'dark') }

onMounted(() => { theme.value = currentTheme() })
</script>

<template>
  <button class="theme-toggle" type="button" :aria-label="theme === 'dark' ? 'Use light theme' : 'Use dark theme'" @click="toggle">
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z" fill="currentColor" /></svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /></svg>
  </button>
</template>

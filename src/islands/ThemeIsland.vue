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
    {{ theme === 'dark' ? '☀' : '☾' }}
  </button>
</template>

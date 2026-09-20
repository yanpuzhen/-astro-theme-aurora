<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface MenuItem { label: string; href: string }
const props = defineProps<{ menu: MenuItem[]; logo: string }>()
const open = ref(false)
const theme = ref<'light' | 'dark'>('dark')

function close() { open.value = false }
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('aurora-theme', theme.value)
}
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape') close() }
function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (!(target instanceof Element) || !target.closest('.mobile-menu-island')) close()
}

onMounted(() => {
  theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div class="mobile-menu-island">
    <button class="mobile-menu-trigger" type="button" aria-controls="mobile-navigation" :aria-expanded="open" aria-label="Open menu" @click.stop="open = !open"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg></button>
    <div v-if="open" class="mobile-menu-backdrop" aria-hidden="true" @click="close"></div>
    <aside v-if="open" id="mobile-navigation" class="mobile-menu-panel" aria-label="Mobile navigation">
      <button class="mobile-menu-close" type="button" aria-label="Close menu" @click="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg></button>
      <div class="mobile-menu-brand"><img :src="props.logo" alt="" /><strong>Aurora</strong><small>AURORA 3.0</small><span aria-hidden="true"></span><p>Futuristic publishing with the original Aurora glow.</p></div>
      <button class="mobile-menu-theme" type="button" @click="toggleTheme"><span>{{ theme === 'dark' ? 'Light theme' : 'Dark theme' }}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path v-if="theme === 'dark'" d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z" fill="currentColor" /><template v-else><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /></template></svg></button>
      <nav>
        <a v-for="item in props.menu" :key="item.href" :href="item.href" @click="close">{{ item.label }}</a>
      </nav>
    </aside>
  </div>
</template>

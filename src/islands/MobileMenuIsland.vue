<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface MenuItem { label: string; href: string }
const props = defineProps<{ menu: MenuItem[] }>()
const open = ref(false)

function close() { open.value = false }
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape') close() }
function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (!(target instanceof Element) || !target.closest('.mobile-menu-island')) close()
}

onMounted(() => {
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
    <button class="mobile-menu-trigger" type="button" aria-controls="mobile-navigation" :aria-expanded="open" aria-label="Open menu" @click.stop="open = !open">☰</button>
    <div v-if="open" class="mobile-menu-backdrop" aria-hidden="true" @click="close"></div>
    <aside v-if="open" id="mobile-navigation" class="mobile-menu-panel" aria-label="Mobile navigation">
      <button class="mobile-menu-close" type="button" aria-label="Close menu" @click="close">×</button>
      <nav>
        <a v-for="item in props.menu" :key="item.href" :href="item.href" @click="close">{{ item.label }}</a>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const open = ref(false)
const image = ref('')
const alt = ref('')
let cleanups: (() => void)[] = []

function close() { open.value = false }
onMounted(() => {
  const images = [...document.querySelectorAll<HTMLImageElement>('.post-html img')]
  for (const element of images) {
    const handler = () => { image.value = element.currentSrc || element.src; alt.value = element.alt; open.value = true }
    element.addEventListener('click', handler)
    cleanups.push(() => element.removeEventListener('click', handler))
  }
})
onUnmounted(() => cleanups.forEach((cleanup) => cleanup()))
</script>

<template>
  <dialog v-if="open" open class="lightbox-dialog" @click.self="close">
    <button type="button" aria-label="Close image" @click="close">×</button>
    <img :src="image" :alt="alt" />
  </dialog>
</template>

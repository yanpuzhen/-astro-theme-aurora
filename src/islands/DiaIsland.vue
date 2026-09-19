<script setup lang="ts">
import { ref } from 'vue'
interface Props { locale?: string; tip?: string }
const props = withDefaults(defineProps<Props>(), { locale: 'en', tip: '' })
const visible = ref(false)
const message = ref(props.tip || (props.locale === 'zh-CN' ? '你好，我是 Dia。' : 'Hello, I am Dia.'))
function toggle() { visible.value = !visible.value }
</script>

<template>
  <aside class="dia-widget" aria-label="Aurora Dia">
    <button type="button" aria-label="Open Dia" @click="toggle">✦</button>
    <p v-if="visible">{{ message }}</p>
  </aside>
</template>

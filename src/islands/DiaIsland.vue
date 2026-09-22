<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AuroraLocale } from '../lib/i18n'

interface Props { locale?: string; tip?: string }
const props = withDefaults(defineProps<Props>(), { locale: 'en', tip: '' })
const locale = computed<AuroraLocale>(() => props.locale === 'zh-CN' ? 'zh-CN' : 'en')
const visible = ref(false)
const active = ref(false)
const message = ref('')
let revealTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

const messages: Record<AuroraLocale, { welcome: string; body: string[]; search: string; link: string; author: string; language: string; theme: string }> = {
  en: {
    welcome: 'Hi, I am Dia. I am here to help you~',
    body: ['Take your time and enjoy the aurora glow.', 'A static page can still feel alive.', 'The archive is waiting for you.'],
    search: 'Try the search when you know what you are looking for!',
    link: 'Enjoy reading: {text}', author: 'Here is a short profile of the Aurora Demo.',
    language: 'This blog speaks more than one language.', theme: 'Click here to switch between light and dark mode.',
  },
  'zh-CN': {
    welcome: '你好，我是 Dia，很高兴遇见你～',
    body: ['慢慢阅读，享受 Aurora 的光芒吧。', '静态页面也可以拥有鲜活的细节。', '归档正在等你探索。'],
    search: '没有找到文章时，可以试试搜索哦～',
    link: '希望你会喜欢这篇文章：{text}', author: '这里是 Aurora Demo 的简介。',
    language: 'Aurora 支持不止一种语言。', theme: '点击这里就可以切换明暗主题啦。',
  },
}

function choose(values: string[]): string { return values[Math.floor(Math.random() * values.length)] || '' }
function show(text: string, duration = 5000) {
  message.value = text.replace(/<[^>]*>/g, '')
  visible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => { visible.value = false }, duration)
}
function contextual(text: string) { show(text, 4500) }
function onDelegatedEvent(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return
  const hooked = target.closest<HTMLElement>('[data-dia], [data-dia-message]')
  if (!hooked) return
  const kind = hooked.dataset.dia
  const custom = hooked.dataset.diaMessage
  if (custom) return contextual(custom)
  if (kind === 'search') return contextual(messages[locale.value].search)
  if (kind === 'author') return contextual(messages[locale.value].author)
  if (kind === 'language') return contextual(messages[locale.value].language)
  if (kind === 'light-switch') return contextual(messages[locale.value].theme)
  if (kind === 'article-link') return contextual(messages[locale.value].link.replace('{text}', hooked.textContent?.trim() || 'this article'))
}
function onMouseOver(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  const dia = target.closest('#Aurora-Dia')
  if (dia) contextual(locale.value === 'zh-CN' ? '哇，你想干嘛呢？O.O' : 'Waaaaaaaa... what are you doing? O.O')
}
function toggle() {
  active.value = !active.value
  show(active.value ? choose(messages[locale.value].body) : messages[locale.value].welcome)
}
onMounted(() => {
  revealTimer = setTimeout(() => { message.value = props.tip || messages[locale.value].welcome; visible.value = true }, 900)
  document.addEventListener('click', onDelegatedEvent)
  document.addEventListener('mouseover', onMouseOver)
})
onBeforeUnmount(() => {
  if (revealTimer) clearTimeout(revealTimer)
  if (hideTimer) clearTimeout(hideTimer)
  document.removeEventListener('click', onDelegatedEvent)
  document.removeEventListener('mouseover', onMouseOver)
})
</script>

<template>
  <aside id="bot-container" class="dia-widget" aria-label="Aurora Dia">
    <div id="Aurora-Dia--body" :class="{ active }">
      <div id="Aurora-Dia--tips-wrapper" :class="{ active: visible }" role="status" aria-live="polite">
        <p id="Aurora-Dia--tips" class="Aurora-Dia--tips">{{ message }}</p>
      </div>
      <button id="Aurora-Dia" class="Aurora-Dia" type="button" aria-label="Talk to Dia" @click="toggle">
        <span id="Aurora-Dia--eyes" class="Aurora-Dia--eyes" aria-hidden="true"><span id="Aurora-Dia--left-eye" class="Aurora-Dia--eye left"></span><span id="Aurora-Dia--right-eye" class="Aurora-Dia--eye right"></span></span>
      </button>
      <span class="Aurora-Dia--platform" aria-hidden="true"></span>
    </div>
  </aside>
</template>

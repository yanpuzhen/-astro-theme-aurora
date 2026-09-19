<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { commentIdentity, commentIdentityAliases, type CommentProvider } from '../lib/comments'
import { adapterFor } from '../lib/comment-adapters'

interface Props { provider: CommentProvider; providerId: 'uid' | 'pathname'; legacyUid: string; canonicalPath: string; legacyPath: string; title: string }
const props = defineProps<Props>()
const host = ref<HTMLElement>()
const status = ref('')
const identity = computed(() => commentIdentity(props.provider, { legacyUid: props.legacyUid, canonicalPath: props.canonicalPath, legacyPath: props.legacyPath, providerId: props.providerId }))
const aliases = computed(() => commentIdentityAliases(props.provider, { legacyUid: props.legacyUid, canonicalPath: props.canonicalPath, legacyPath: props.legacyPath, providerId: props.providerId }))

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = url; script.async = true
    script.onload = () => resolve(); script.onerror = () => reject(new Error(`Unable to load ${props.provider}`)); document.head.appendChild(script)
  })
}

onMounted(async () => {
  const adapter = adapterFor(props.provider)
  if (!adapter.scriptUrl || !host.value) return
  try {
    await loadScript(adapter.scriptUrl)
    if (props.provider === 'valine' && (window as any).Valine && import.meta.env.PUBLIC_VALINE_APP_ID && import.meta.env.PUBLIC_VALINE_APP_KEY) {
      new (window as any).Valine({ el: host.value, appId: import.meta.env.PUBLIC_VALINE_APP_ID, appKey: import.meta.env.PUBLIC_VALINE_APP_KEY, path: identity.value })
    } else if (props.provider === 'gitalk' && (window as any).Gitalk && import.meta.env.PUBLIC_GITALK_CLIENT_ID && import.meta.env.PUBLIC_GITALK_OWNER && import.meta.env.PUBLIC_GITALK_REPO) {
      new (window as any).Gitalk({ clientID: import.meta.env.PUBLIC_GITALK_CLIENT_ID, owner: import.meta.env.PUBLIC_GITALK_OWNER, repo: import.meta.env.PUBLIC_GITALK_REPO, id: identity.value, pathname: props.canonicalPath }).render(host.value)
    } else if (props.provider === 'twikoo' && (window as any).twikoo && import.meta.env.PUBLIC_TWIKOO_ENV_ID) {
      await (window as any).twikoo.init({ envId: import.meta.env.PUBLIC_TWIKOO_ENV_ID, el: host.value, path: identity.value })
    } else if (props.provider === 'waline' && (window as any).Waline && import.meta.env.PUBLIC_WALINE_SERVER_URL) {
      ;(window as any).Waline.init({ el: host.value, serverURL: import.meta.env.PUBLIC_WALINE_SERVER_URL, path: identity.value })
    } else {
      status.value = `${props.provider} identity is preserved; its public provider settings are incomplete.`
    }
  } catch { status.value = `Unable to load the ${props.provider} client adapter.` }
})
</script>

<template>
  <div class="comment-island" :data-provider="provider" :data-comment-id="identity" :data-comment-aliases="aliases.join('|')">
    <p>{{ title }}</p><div ref="host"></div><p v-if="status">{{ status }}</p>
  </div>
</template>

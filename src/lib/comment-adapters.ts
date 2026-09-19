import type { CommentProvider } from './comments'

export interface CommentAdapter { provider: CommentProvider; identityMode: 'uid' | 'pathname'; scriptUrl?: string }
export const commentAdapters: Record<CommentProvider, CommentAdapter> = {
  gitalk: { provider: 'gitalk', identityMode: 'uid', scriptUrl: 'https://unpkg.com/gitalk@1.8.0/dist/gitalk.min.js' },
  valine: { provider: 'valine', identityMode: 'pathname', scriptUrl: 'https://unpkg.com/valine@1.5.1/dist/Valine.min.js' },
  twikoo: { provider: 'twikoo', identityMode: 'pathname', scriptUrl: 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js' },
  waline: { provider: 'waline', identityMode: 'pathname', scriptUrl: 'https://unpkg.com/@waline/client@v3/dist/waline.js' },
  none: { provider: 'none', identityMode: 'uid' },
}
export function adapterFor(provider: CommentProvider): CommentAdapter { return commentAdapters[provider] }

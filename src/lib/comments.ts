export type CommentProvider = 'gitalk' | 'valine' | 'twikoo' | 'waline' | 'none'
export interface CommentIdentityInput { legacyUid: string; canonicalPath: string; legacyPath: string; providerId?: 'uid' | 'pathname' }

export function normalizeCommentPath(path: string): string {
  const pathname = path.replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '').split(/[?#]/, 1)[0]
  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
}

export function commentIdentity(provider: CommentProvider, input: CommentIdentityInput): string {
  if (provider === 'gitalk') return input.providerId === 'pathname' ? normalizeCommentPath(input.legacyPath || input.canonicalPath) : input.legacyUid
  if (provider === 'valine' || provider === 'twikoo' || provider === 'waline') return normalizeCommentPath(input.legacyPath || input.canonicalPath)
  return input.legacyUid
}

export function commentIdentityAliases(provider: CommentProvider, input: CommentIdentityInput): string[] {
  const values = new Set([commentIdentity(provider, input), normalizeCommentPath(input.canonicalPath), input.legacyUid])
  return [...values]
}

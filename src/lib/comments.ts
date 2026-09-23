/** Providers with a bundled Aurora 3 browser runtime. */
export type CommentProvider = 'valine' | 'twikoo' | 'waline' | 'none'
/** Gitalk is accepted only by the identity mapper for migration compatibility. */
export type CommentIdentityProvider = 'gitalk' | Exclude<CommentProvider, 'none'>
export interface CommentIdentityInput { legacyUid: string; canonicalPath: string; legacyPath: string; providerId?: 'uid' | 'pathname' }

export function normalizeCommentPath(path: string, trailingSlash = true): string {
  const pathname = String(path || '/').replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '').split(/[?#]/, 1)[0] || '/'
  const clean = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  return trailingSlash || clean === '/' ? clean : clean.slice(0, -1)
}

export function commentIdentity(provider: CommentIdentityProvider, input: CommentIdentityInput): string {
  const legacyPath = input.legacyPath || input.canonicalPath
  if (provider === 'gitalk') return input.providerId === 'pathname' ? normalizeCommentPath(legacyPath) : input.legacyUid
  // Aurora 2.x calls cleanPath() for Valine, which removes a non-root final
  // slash. Twikoo and Waline receive the current pathname unchanged.
  if (provider === 'valine') return normalizeCommentPath(legacyPath, false)
  if (provider === 'twikoo' || provider === 'waline') return normalizeCommentPath(legacyPath)
  return input.legacyUid
}

export function commentIdentityAliases(provider: CommentIdentityProvider, input: CommentIdentityInput): string[] {
  const values = new Set([
    commentIdentity(provider, input),
    normalizeCommentPath(input.legacyPath || input.canonicalPath),
    normalizeCommentPath(input.canonicalPath),
    input.legacyUid,
  ])
  return [...values]
}

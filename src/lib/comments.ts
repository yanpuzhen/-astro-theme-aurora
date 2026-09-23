/** Providers available to Aurora 3 at runtime. */
export type CommentProvider = 'giscus' | 'valine' | 'twikoo' | 'waline' | 'none'
export interface CommentIdentityInput { legacyUid: string; canonicalPath: string; legacyPath: string }

export function normalizeCommentPath(path: string, trailingSlash = true): string {
  const pathname = String(path || '/').replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '').split(/[?#]/, 1)[0] || '/'
  const clean = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  return trailingSlash || clean === '/' ? clean : clean.slice(0, -1)
}

export function commentIdentity(provider: Exclude<CommentProvider, 'none'>, input: CommentIdentityInput): string {
  const legacyPath = input.legacyPath || input.canonicalPath
  // Aurora 2.x calls cleanPath() for Valine, which removes a non-root final
  // slash. Twikoo and Waline receive the current pathname unchanged.
  if (provider === 'valine') return normalizeCommentPath(legacyPath, false)
  if (provider === 'twikoo' || provider === 'waline') return normalizeCommentPath(legacyPath)
  return normalizeCommentPath(input.canonicalPath)
}

export function commentIdentityAliases(provider: Exclude<CommentProvider, 'none'>, input: CommentIdentityInput): string[] {
  const values = new Set([
    commentIdentity(provider, input),
    normalizeCommentPath(input.legacyPath || input.canonicalPath),
    normalizeCommentPath(input.canonicalPath),
    input.legacyUid,
  ])
  return [...values]
}

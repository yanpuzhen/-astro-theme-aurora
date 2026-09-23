import { normalizeCommentPath, type CommentIdentityInput } from '../comments.ts'

/** Historical Aurora 2 issue key for one-off Gitalk → Discussions migration checks. */
export function legacyGitalkIdentity(input: CommentIdentityInput, mode: 'uid' | 'pathname' = 'uid'): string {
  return mode === 'pathname' ? normalizeCommentPath(input.legacyPath || input.canonicalPath) : input.legacyUid
}

export function legacyGitalkIdentityAliases(input: CommentIdentityInput, mode: 'uid' | 'pathname' = 'uid'): string[] {
  return [...new Set([
    legacyGitalkIdentity(input, mode),
    normalizeCommentPath(input.legacyPath || input.canonicalPath),
    normalizeCommentPath(input.canonicalPath),
    input.legacyUid,
  ])]
}

import { createHash } from 'node:crypto'

/**
 * Exact equivalent of hexo-plugin-aurora/lib/helpers/utils.js::generateUid.
 *
 * The legacy helper hashes the input bytes as supplied. In particular, it does
 * not trim, collapse whitespace, or normalize Unicode before hashing.
 */
export function legacyUid(title: string, kind: 'post' | 'page' = 'post'): string {
  return createHash('md5')
    .update(`${kind === 'page' ? 'page_uid___' : 'post_uid___'}${title}`)
    .digest('hex')
}

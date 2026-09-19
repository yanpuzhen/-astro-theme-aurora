interface HElement {
  type?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HElement[]
}
interface RehypeOptions { base?: string }

function prefixRawAssetUrls(value: string, base: string): string {
  if (!base) return value
  return value.replace(/(\b(?:href|src)\s*=\s*["'])(\/[^"']*)/gi, (match, prefix: string, path: string) => {
    if (path.startsWith('//') || path === base || path.startsWith(`${base}/`)) return match
    return `${prefix}${base}${path}`
  })
}

function visit(nodes: HElement[], base: string): void {
  for (const node of nodes) {
    if (node.type === 'raw' && typeof node.value === 'string') node.value = prefixRawAssetUrls(node.value, base)
    if (node.type === 'element' && node.properties) {
      for (const key of ['href', 'src']) {
        const value = node.properties[key]
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith(base)) node.properties[key] = `${base}${value}`
      }
    }
    if (node.children) visit(node.children, base)
  }
}

export function rehypeBasePath(options: RehypeOptions = {}) {
  const base = options.base && options.base !== '/' ? options.base.replace(/\/$/, '') : ''
  return (tree: HElement) => { if (tree.children) visit(tree.children, base) }
}

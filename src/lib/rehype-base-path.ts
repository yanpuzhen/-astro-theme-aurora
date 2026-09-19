interface HElement {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HElement[]
}
interface RehypeOptions { base?: string }

function visit(nodes: HElement[], base: string): void {
  for (const node of nodes) {
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

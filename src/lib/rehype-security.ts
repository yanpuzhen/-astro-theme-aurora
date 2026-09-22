interface HNode {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HNode[]
}

const removedTags = new Set(['base', 'embed', 'form', 'iframe', 'input', 'meta', 'object', 'script', 'style', 'textarea'])
const urlProperties = new Set(['action', 'cite', 'formaction', 'href', 'poster', 'src', 'xlinkHref', 'xlink:href'])

function safeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed || trimmed.startsWith('/') || trimmed.startsWith('#')) return true
  return /^(?:https?:|mailto:|tel:)/.test(trimmed)
}

function visit(nodes: HNode[]): HNode[] {
  const kept: HNode[] = []
  for (const node of nodes) {
    if (node.type === 'element' && node.tagName && removedTags.has(node.tagName.toLowerCase())) continue
    if (node.type === 'element' && node.properties) {
      for (const key of Object.keys(node.properties)) {
        const normalized = key.replace(/[-:]/g, '').toLowerCase()
        const value = node.properties[key]
        if (normalized.startsWith('on') || normalized === 'srcdoc' || normalized === 'style') {
          delete node.properties[key]
        } else if (urlProperties.has(key) && typeof value === 'string' && !safeUrl(value)) {
          delete node.properties[key]
        }
      }
      if (node.properties.target === '_blank') {
        const rel = typeof node.properties.rel === 'string' ? node.properties.rel.split(/\s+/) : []
        node.properties.rel = [...new Set([...rel, 'noopener', 'noreferrer'])].join(' ')
      }
    }
    if (node.children) node.children = visit(node.children)
    kept.push(node)
  }
  return kept
}

/** Keep useful Markdown media and details while removing executable raw HTML. */
export function rehypeSecurity() {
  return (tree: HNode) => {
    if (tree.children) tree.children = visit(tree.children)
  }
}

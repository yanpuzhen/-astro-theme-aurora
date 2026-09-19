interface MarkdownNode {
  type?: string; value?: string; children?: MarkdownNode[]; data?: Record<string, unknown>; properties?: Record<string, unknown>
}

const containerPattern = /^:::(tip|warning|danger|details)\s*\n?([\s\S]*?)\n?:::$/i
interface RemarkOptions { base?: string }
function textValue(node: MarkdownNode): string { return node.children?.map(textValue).join('') ?? node.value ?? '' }

function visit(nodes: MarkdownNode[], base: string): void {
  for (const node of nodes) {
    const url = (node as MarkdownNode & { url?: unknown }).url
    if ((node.type === 'link' || node.type === 'image') && typeof url === 'string' && url.startsWith('/') && !url.startsWith(base)) {
      ;(node as MarkdownNode & { url: string }).url = `${base}${url}`
    }
    const properties = node.properties
    if (properties) {
      for (const key of ['href', 'src']) {
        const value = properties[key]
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith(import.meta.env.BASE_URL)) {
          const base = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
          properties[key] = `${base}${value}`
        }
      }
    }
    if (node.type === 'html' && /<\s*script(?:\s|>)/i.test(node.value || '')) {
      node.type = 'text'; node.value = '[script removed from Markdown]'; delete node.children; continue
    }
    if (node.type === 'paragraph') {
      const match = containerPattern.exec(textValue(node).trim())
      if (match) {
        node.type = 'blockquote'
        node.children = [{ type: 'paragraph', children: [{ type: 'text', value: match[2].trim() }] }]
        node.data = { hProperties: { className: ['aurora-container', `aurora-${match[1].toLowerCase()}`] } }
      }
    }
    if (node.children) visit(node.children, base)
  }
}

export function remarkAurora(options: RemarkOptions = {}) {
  const base = options.base && options.base !== '/' ? options.base.replace(/\/$/, '') : ''
  return (tree: MarkdownNode) => { if (tree.children) visit(tree.children, base) }
}

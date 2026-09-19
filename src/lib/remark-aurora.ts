interface MarkdownNode {
  type?: string; value?: string; meta?: string | null; children?: MarkdownNode[]; data?: Record<string, unknown>; properties?: Record<string, unknown>
}

const containerPattern = /^:::(tip|warning|danger|details)\s*\n?([\s\S]*?)\n?:::$/i
interface RemarkOptions { base?: string }
function textValue(node: MarkdownNode): string { return node.children?.map(textValue).join('') ?? node.value ?? '' }

function fenceMetadata(meta: string): Record<string, string> {
  const result: Record<string, string> = {}
  const quoted = /(?:title|filename|file)=(?:"([^"]+)"|'([^']+)'|([^\s]+))/gi
  for (const match of meta.matchAll(quoted)) result['data-code-title'] = match[1] || match[2] || match[3]
  if (/\b(?:line-numbers|lineNumbers|ln)\b/i.test(meta)) result['data-line-numbers'] = ''
  const highlight = meta.match(/\{([\d, -]+)\}/)
  if (highlight) result['data-highlight-lines'] = highlight[1].replace(/\s+/g, '')
  return result
}

function prefixRawAssetUrls(value: string, base: string): string {
  if (!base) return value
  return value.replace(/(\b(?:href|src)\s*=\s*["'])(\/[^"']*)/gi, (match, prefix: string, path: string) => {
    if (path.startsWith('//') || path === base || path.startsWith(`${base}/`)) return match
    return `${prefix}${base}${path}`
  })
}

function visit(nodes: MarkdownNode[], base: string): void {
  for (const node of nodes) {
    if (node.type === 'code' && node.meta) {
      const properties = fenceMetadata(node.meta)
      if (Object.keys(properties).length > 0) {
        // Keep the original meta string on the HAST code node. Astro wraps it
        // for Shiki; the Aurora Shiki transformer parses it and adds the
        // compatibility attributes to the generated <pre>.
        node.data = { ...(node.data || {}), hProperties: { metastring: node.meta } }
        delete node.meta
      }
    }
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
    if (node.type === 'html' && typeof node.value === 'string') {
      node.value = prefixRawAssetUrls(node.value, base)
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

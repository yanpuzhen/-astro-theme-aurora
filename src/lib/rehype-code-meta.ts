interface HNode {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HNode[]
}

function value(properties: Record<string, unknown>, name: string): unknown {
  return properties[name] ?? properties[name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())]
}

function visit(nodes: HNode[]): void {
  for (const node of nodes) {
    if (node.type === 'element' && node.tagName === 'pre' && node.properties) {
      const title = value(node.properties, 'data-code-title')
      const lineNumbers = value(node.properties, 'data-line-numbers')
      const highlights = value(node.properties, 'data-highlight-lines')
      if (typeof title === 'string') node.properties['data-code-title'] = title
      if (lineNumbers !== undefined) node.properties['data-line-numbers'] = ''
      if (typeof highlights === 'string') node.properties['data-highlight-lines'] = highlights
    }
    if (node.children) visit(node.children)
  }
}

export function rehypeCodeMeta() {
  return (tree: HNode) => { if (tree.children) visit(tree.children) }
}

interface ShikiElement { properties: Record<string, unknown> }

function metadata(raw: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const quoted = /(?:title|filename|file)=(?:"([^"]+)"|'([^']+)'|([^\s]+))/i.exec(raw)
  if (quoted) result['data-code-title'] = quoted[1] || quoted[2] || quoted[3]
  if (/\b(?:line-numbers|lineNumbers|ln)\b/i.test(raw)) result['data-line-numbers'] = ''
  const highlight = /\{([\d, -]+)\}/.exec(raw)
  if (highlight) result['data-highlight-lines'] = highlight[1].replace(/\s+/g, '')
  return result
}

/** Preserve the most common legacy fence metadata while keeping Shiki as the sole highlighter. */
export const shikiAuroraTransformer = {
  name: 'aurora-fence-metadata',
  pre(this: { options: { meta?: { __raw?: unknown } } }, node: ShikiElement) {
    const raw = this.options.meta?.__raw
    if (typeof raw === 'string') Object.assign(node.properties, metadata(raw))
    return node
  },
}

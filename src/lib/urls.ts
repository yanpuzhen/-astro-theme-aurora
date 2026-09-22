/** Return only schemes that are safe for user-configured external links. */
export function safeExternalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  return /^(?:https?:|mailto:|tel:)/i.test(trimmed) ? trimmed : undefined
}

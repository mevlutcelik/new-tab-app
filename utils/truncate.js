export function truncate(text, maxLength = 20) {
  if (!text) return ""
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}
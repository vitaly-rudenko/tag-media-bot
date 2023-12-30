export function escapeRegex(string: string) {
  return string.replaceAll(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}

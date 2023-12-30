export function normalizeTagValue(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\s]+/g, '')
    .replace(/[\s]+/g, ' ')
    .trim()
}

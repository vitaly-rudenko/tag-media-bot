export function normalizeTagValue(input: string): string {
  return input.toLowerCase().trim().replaceAll(/\s+/g, ' ')
}

import { normalizeTagValue } from './normalizeTagValue'

export function parseTagValue(input: string): string[] {
  const values = input.split(/(?:,|\n)/g)
  const result: { value: string; priority: number }[] = []

  for (const value of values) {
    const parts = normalizeTagValue(value).split(' ')
    const variations = parts.map((_, i) => parts.slice(i).join(' '))

    for (const [priority, variation] of variations.entries()) {
      if (variation) {
        if (result.some((r) => r.value.startsWith(variation))) continue
        let index
        do {
          index = result.findIndex((r) => variation.startsWith(r.value))
          if (index !== -1) {
            result.splice(index, 1)
          }
        } while (index !== -1)
        result.push({ value: variation, priority })
      }
    }
  }

  result.sort((a, b) => a.priority - b.priority)

  return [...new Set(result.map((r) => r.value))]
}

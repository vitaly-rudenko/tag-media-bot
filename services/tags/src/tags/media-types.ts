export const mediaTypes = ['audio', 'video', 'photo', 'document', 'gif', 'mpeg4_gif'] as const

export type MediaType = (typeof mediaTypes)[number]

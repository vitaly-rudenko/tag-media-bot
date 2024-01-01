export const mediaTypes = ['audio', 'video', 'photo', 'document', 'gif', 'mpeg4_gif'] as const

export type MediaType = (typeof mediaTypes)[number]

export type CreateTagDto = {
  authorUserId: number
  values: string[]
  type: MediaType
  fileName?: string
  fileUniqueId: string
  fileId: string
}

export type SearchTagsDto = {
  query: string
  limit: number
  authorUserId?: number
}

export type SearchResultDto = {
  type: MediaType
  fileName?: string
  fileId: string
}

export type Tag = {
  authorUserId: number
  values: string[]
  type: MediaType
  fileName?: string
  fileUniqueId: string
  fileId: string
  createdAt: Date
}

export class Tags {
  tags: Tag[] = []

  async create(input: CreateTagDto): Promise<Tag> {
    const tag = {
      authorUserId: input.authorUserId,
      type: input.type,
      fileName: input.fileName,
      fileId: input.fileId,
      fileUniqueId: input.fileUniqueId,
      values: input.values,
      createdAt: new Date(),
    }

    this.tags.push(tag)

    return tag
  }

  async search(input: SearchTagsDto): Promise<SearchResultDto[]> {
    return this.tags
      .filter((tag) => tag.values.some((value) => value.startsWith(input.query)))
      .map((tag) => ({ type: tag.type, fileName: tag.fileName, fileId: tag.fileId }))
  }
}

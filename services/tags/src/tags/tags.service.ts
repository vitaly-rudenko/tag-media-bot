import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateTagDto } from './dto/create-tag.dto'
import { SearchTagsDto } from './dto/search-tags.dto'
import { SearchResultItemDto } from './dto/search-result.dto'
import { Tag } from './tag.schema'
import { normalizeTagValue } from './normalize-tag-value'
import { escapeRegex } from '../utils/escape-regex'

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  async create(input: CreateTagDto): Promise<Tag> {
    const { authorUserId, type, fileName, fileUniqueId, fileId, values } = input

    return await this.tagModel.create({
      authorUserId,
      type,
      fileName,
      fileUniqueId,
      fileId,
      values: values.map(normalizeTagValue),
      createdAt: new Date(),
    })
  }

  async search(input: SearchTagsDto): Promise<SearchResultItemDto[]> {
    const query = normalizeTagValue(input.query)

    const fileUniqueIds = new Set<string>()
    const searchResults = []

    const cursor = this.tagModel
      .find({
        values: { $regex: `^${escapeRegex(query)}` },
        ...(input.authorUserId && { authorUserId: input.authorUserId }),
      })
      .cursor({ batchSize: 100 })

    for await (const tag of cursor) {
      if (fileUniqueIds.has(tag.fileUniqueId)) continue
      fileUniqueIds.add(tag.fileUniqueId)
      searchResults.push({
        type: tag.type,
        fileName: tag.fileName,
        fileId: tag.fileId,
      })

      if (fileUniqueIds.size === input.limit) break
    }

    return searchResults
  }
}

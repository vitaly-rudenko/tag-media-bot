import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateTagDto } from './dto/create-tag.dto'
import { Tag } from './tag.schema'
import { SearchTagsDto } from './dto/search-tags.dto'
import { parseTagValue } from './utils/parseTagValue'
import { escapeRegex } from 'src/utils/escapeRegexp'
import { normalizeTagValue } from './utils/normalizeTagValue'

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  async create({
    authorUserId,
    fileUniqueId,
    fileId,
    tagValue,
  }: CreateTagDto): Promise<Tag> {
    return await this.tagModel.create({
      authorUserId,
      fileUniqueId,
      fileId,
      tags: parseTagValue(tagValue),
      createdAt: new Date(),
    })
  }

  async search(input: SearchTagsDto): Promise<string[]> {
    const query = normalizeTagValue(input.query)

    const fileUniqueIds = new Set<string>()
    const fileIds = []

    const cursor = this.tagModel
      .find({
        tags: { $regex: `^${escapeRegex(query)}` },
        ...(input.authorUserId && { authorUserId: input.authorUserId }),
      })
      .cursor({ batchSize: 100 })

    for await (const tag of cursor) {
      if (fileUniqueIds.has(tag.fileUniqueId)) continue
      fileUniqueIds.add(tag.fileUniqueId)
      fileIds.push(tag.fileId)

      if (fileUniqueIds.size === input.limit) break
    }

    return fileIds
  }
}

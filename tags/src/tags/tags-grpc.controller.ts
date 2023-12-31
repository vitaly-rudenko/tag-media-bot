import { status } from '@grpc/grpc-js'
import { Controller } from '@nestjs/common'
import { TagsService } from './tags.service'
import { MediaType } from './media-types'
import { CreateTagDto } from './dto/create-tag.dto'
import { SearchTagsDto } from './dto/search-tags.dto'
import { validateOrReject } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import type {
  CreateTag,
  Empty,
  MediaType as GrpcMediaType,
  SearchResults,
  SearchTags,
  TagsService as GrpcTagsService,
} from '@tag-media-bot/grpc'

const mediaTypeMap: Record<GrpcMediaType, MediaType> = {
  AUDIO: 'audio',
  DOCUMENT: 'document',
  GIF: 'gif',
  MPEG4_GIF: 'mpeg4_gif',
  PHOTO: 'photo',
  VIDEO: 'video',
}

const mediaTypeInvertedMap = Object.fromEntries(
  Object.entries(mediaTypeMap).map(([key, value]) => [value, key]),
) as Record<MediaType, GrpcMediaType>

async function toDto<T extends object, V>(cls: ClassConstructor<T>, input: V): Promise<T> {
  const dto = plainToInstance<T, V>(cls, input)

  try {
    await validateOrReject(dto)
  } catch (errors) {
    throw new RpcException({ code: status.INVALID_ARGUMENT })
  }

  return dto
}

@Controller('tags')
export class TagsGrpcController implements GrpcTagsService {
  constructor(private readonly tagsService: TagsService) {}

  @GrpcMethod('tags', 'Create')
  async Create(input: CreateTag): Promise<Empty> {
    const dto = await toDto(CreateTagDto, {
      type: mediaTypeMap[input.type],
      authorUserId: input.authorUserId,
      fileId: input.fileId,
      fileUniqueId: input.fileUniqueId,
      fileName: input.fileName,
      values: input.values,
    })

    await this.tagsService.create(dto)

    return {}
  }

  @GrpcMethod('tags', 'Search')
  async Search(input: SearchTags): Promise<SearchResults> {
    const dto = await toDto(SearchTagsDto, input)
    const searchResults = await this.tagsService.search(dto)

    return {
      items: searchResults.map((result) => ({
        type: mediaTypeInvertedMap[result.type],
        fileId: result.fileId,
        fileName: result.fileName,
      })),
    }
  }
}

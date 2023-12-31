import { status } from '@grpc/grpc-js'
import { Controller } from '@nestjs/common'
import { TagsService } from './tags.service'
import { MediaType } from './media-types'
import { Empty } from 'src/generated/grpc/google/protobuf/empty'
import {
  CreateTag,
  MediaType as GrpcMediaType,
  SearchResults,
  SearchTags,
  TagsServiceControllerMethods,
} from 'src/generated/grpc/src/tags/tags'
import { CreateTagDto } from './dto/create-tag.dto'
import { SearchTagsDto } from './dto/search-tags.dto'
import { validateOrReject } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { RpcException } from '@nestjs/microservices'

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

async function toDto<T extends object, V>(
  cls: ClassConstructor<T>,
  input: V,
): Promise<T> {
  const dto = plainToInstance<T, V>(cls, input)

  try {
    await validateOrReject(dto)
  } catch (errors) {
    throw new RpcException({ code: status.INVALID_ARGUMENT })
  }

  return dto
}

@Controller('tags')
@TagsServiceControllerMethods()
export class TagsGrpcController {
  constructor(private readonly tagsService: TagsService) {}

  async create(input: CreateTag): Promise<Empty> {
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

  async search(input: SearchTags): Promise<SearchResults> {
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

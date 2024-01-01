import { status } from '@grpc/grpc-js'
import { Controller } from '@nestjs/common'
import { TagsService } from './tags.service'
import { MediaType, mediaTypes } from './media-types'
import { CreateTagDto } from './dto/create-tag.dto'
import { SearchTagsDto } from './dto/search-tags.dto'
import { ValidationError, validateOrReject } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import {
  CreateTag,
  Empty,
  MediaType as GrpcMediaType,
  SearchResults,
  SearchTags,
  TagsService as GrpcService,
} from '@tag-media-bot/grpc'

const grpcMediaTypeMap: Record<MediaType, GrpcMediaType> = {
  audio: GrpcMediaType.AUDIO,
  document: GrpcMediaType.DOCUMENT,
  gif: GrpcMediaType.GIF,
  mpeg4_gif: GrpcMediaType.MPEG4_GIF,
  photo: GrpcMediaType.PHOTO,
  video: GrpcMediaType.VIDEO,
}

const mediaTypeMap = mediaTypes.reduce(
  (result, type) => ({ ...result, [grpcMediaTypeMap[type]]: type }),
  {} as Record<GrpcMediaType, MediaType>,
)

async function toDto<T extends object, V>(cls: ClassConstructor<T>, input: V): Promise<T> {
  const dto = plainToInstance<T, V>(cls, input)

  try {
    await validateOrReject(dto)
  } catch (error: unknown) {
    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        ...(error[0].constraints && { message: Object.values(error[0].constraints)[0] }),
      })
    }

    throw error
  }

  return dto
}

@Controller()
export class TagsGrpcController implements GrpcService {
  constructor(private readonly tagsService: TagsService) {}

  @GrpcMethod('TagsService', 'Create')
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

  @GrpcMethod('TagsService', 'Search')
  async search(input: SearchTags): Promise<SearchResults> {
    const dto = await toDto(SearchTagsDto, input)
    const searchResults = await this.tagsService.search(dto)

    return {
      items: searchResults.map((result) => ({
        type: grpcMediaTypeMap[result.type],
        fileId: result.fileId,
        fileName: result.fileName,
      })),
    }
  }
}

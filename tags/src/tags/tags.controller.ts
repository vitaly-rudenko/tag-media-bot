import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { TagsService } from './tags.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { SearchTagsDto } from './dto/search-tags.dto'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() input: CreateTagDto) {
    await this.tagsService.create(input)
  }

  @Get()
  async search(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeUnsetFields: false,
        },
        // forbid unknown properties
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    input: SearchTagsDto,
  ): Promise<string[]> {
    return this.tagsService.search(input)
  }
}

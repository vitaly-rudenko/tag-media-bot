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
import { SearchResultItemDto } from './dto/search-result.dto'

@Controller('tags')
export class TagsHttpController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() input: CreateTagDto): Promise<void> {
    await this.tagsService.create(input)
  }

  @Get()
  async search(@Query() input: SearchTagsDto): Promise<SearchResultItemDto[]> {
    return this.tagsService.search(input)
  }
}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TagsService } from './tags.service'
import { Tag, TagSchema } from './tag.schema'
import { TagsHttpController } from './tags-http.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsHttpController],
  providers: [TagsService],
})
export class TagsModule {}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TagsService } from './tags.service'
import { Tag, TagSchema } from './tag.schema'
import { TagsHttpController } from './tags-http.controller'
import { TagsGrpcController } from './tags-grpc.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsHttpController, TagsGrpcController],
  providers: [TagsService],
})
export class TagsModule {}

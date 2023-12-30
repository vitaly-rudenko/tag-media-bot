import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TagDocument = HydratedDocument<Tag>

@Schema()
export class Tag {
  @Prop()
  authorUserId: string

  @Prop()
  tags: string[]

  @Prop()
  fileUniqueId: string

  @Prop()
  fileId: string

  @Prop()
  createdAt: Date
}

export const TagSchema = SchemaFactory.createForClass(Tag)

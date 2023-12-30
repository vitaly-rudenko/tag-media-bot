import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { MediaType } from './media-types'

export type TagDocument = HydratedDocument<Tag>

@Schema()
export class Tag {
  @Prop()
  authorUserId: number

  @Prop()
  values: string[]

  @Prop()
  type: MediaType

  @Prop()
  fileName?: string

  @Prop()
  fileUniqueId: string

  @Prop()
  fileId: string

  @Prop()
  createdAt: Date
}

export const TagSchema = SchemaFactory.createForClass(Tag)

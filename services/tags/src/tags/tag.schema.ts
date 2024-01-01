import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { MediaType, mediaTypes } from './media-types'

export type TagDocument = HydratedDocument<Tag>

@Schema()
export class Tag {
  @Prop({ type: Number, required: true })
  authorUserId: number

  @Prop({ type: [String], required: true })
  values: string[]

  @Prop({ type: String, enum: mediaTypes, required: true })
  type: MediaType

  @Prop({ type: String })
  fileName?: string

  @Prop({ type: String, required: true })
  fileUniqueId: string

  @Prop({ type: String, required: true })
  fileId: string

  @Prop({ type: Date, required: true })
  createdAt: Date
}

export const TagSchema = SchemaFactory.createForClass(Tag)

import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { MediaType, mediaTypes } from '../types'

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  readonly authorUserId: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly tagValue: string

  @IsIn(mediaTypes)
  readonly type: MediaType

  @IsNotEmpty()
  @IsString()
  readonly fileUniqueId: string

  @IsNotEmpty()
  @IsString()
  readonly fileId: string
}

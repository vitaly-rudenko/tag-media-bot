import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { MediaType, mediaTypes } from '../media-types'
import { IsUndefinable } from '../../utils/decorators'

export class CreateTagDto {
  @IsInt()
  readonly authorUserId: number

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(20, { each: true })
  readonly values: string[]

  @IsIn(mediaTypes)
  readonly type: MediaType

  @IsNotEmpty()
  @IsString()
  readonly fileUniqueId: string

  @IsNotEmpty()
  @IsString()
  readonly fileId: string

  @IsUndefinable()
  @IsNotEmpty()
  @IsString()
  readonly fileName?: string
}

import { Expose, Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class SearchTagsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly query: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  readonly limit: number = 50

  @Expose({ name: 'author_user_id' })
  @IsString()
  @IsOptional()
  readonly authorUserId?: string
}
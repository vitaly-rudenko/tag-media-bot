import { Expose, Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { IsUndefinable } from '../../utils/decorators'

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
  readonly limit: number

  @Expose({ name: 'author_user_id' })
  @Type(() => Number)
  @IsInt()
  @IsUndefinable()
  readonly authorUserId?: number
}

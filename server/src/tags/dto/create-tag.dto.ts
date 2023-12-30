import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  readonly authorUserId: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly tagValue: string

  @IsNotEmpty()
  @IsString()
  readonly fileUniqueId: string

  @IsNotEmpty()
  @IsString()
  readonly fileId: string
}

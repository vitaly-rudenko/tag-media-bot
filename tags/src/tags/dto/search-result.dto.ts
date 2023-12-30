import { MediaType } from '../types'

export class SearchResultDto {
  readonly type: MediaType
  readonly fileName?: string
  readonly fileId: string
}

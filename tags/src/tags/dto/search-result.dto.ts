import { MediaType } from '../media-types'

export class SearchResultDto {
  readonly type: MediaType
  readonly fileName?: string
  readonly fileId: string
}

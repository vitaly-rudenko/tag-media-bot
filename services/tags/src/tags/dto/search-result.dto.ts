import { MediaType } from '../media-types'

export class SearchResultItemDto {
  readonly type: MediaType
  readonly fileName?: string
  readonly fileId: string
}

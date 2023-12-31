import * as path from 'path'

export { Empty } from './generated/google/protobuf/empty'

export {
  protobufPackage as tagsPackage,
  CreateTag,
  MediaType,
  SearchResultItem,
  SearchResults,
  SearchTags,
  TagsService,
} from './generated/proto/tags'

export const protoPath = path.resolve(__dirname, '..', 'proto')

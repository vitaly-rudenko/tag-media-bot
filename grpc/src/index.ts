import path from 'path'

export { Empty } from './generated/google/protobuf/empty.js'

export {
  protobufPackage as tagsPackage,
  CreateTag,
  MediaType,
  SearchResultItem,
  SearchResults,
  SearchTags,
  TagsService,
} from './generated/proto/tags.js'

export const protoPath = path.resolve(__dirname, '..', 'proto')

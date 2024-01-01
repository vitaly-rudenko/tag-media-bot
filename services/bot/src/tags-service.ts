import { ChannelCredentials } from '@grpc/grpc-js'
import { promisifyClient, TagsServiceClient } from '@tag-media-bot/grpc'

export const tagsService = promisifyClient(
  new TagsServiceClient(process.env.TAGS_SERVICE_GRPC_URL!, ChannelCredentials.createInsecure()),
)

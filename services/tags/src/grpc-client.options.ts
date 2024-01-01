import { join } from 'path'
import { ClientOptions, Transport } from '@nestjs/microservices'
import { protoPath, tagsPackage } from '@tag-media-bot/grpc'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_URL ?? '0.0.0.0:5000',
    package: tagsPackage,
    protoPath: join(protoPath, 'tags.proto'),
    loader: {
      defaults: true,
      longs: Number,
    },
  },
}

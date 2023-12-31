import { join } from 'path'
import { ClientOptions, Transport } from '@nestjs/microservices'
import { protoPath } from '@tag-media-bot/grpc'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_URL ?? 'localhost:3002',
    package: 'tags',
    protoPath: join(protoPath, 'tags.proto'),
    loader: {
      longs: Number,
      enums: String,
    },
  },
}

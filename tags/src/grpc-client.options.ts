import { join } from 'path'
import { ClientOptions, Transport } from '@nestjs/microservices'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'tags',
    protoPath: join(__dirname, './tags/tags.proto'),
    loader: {
      longs: Number,
      enums: String,
    },
  },
}

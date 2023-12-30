import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { grpcClientOptions } from './grpc-client.options'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice(grpcClientOptions)

  app.useGlobalPipes(new ValidationPipe())

  await app.startAllMicroservices()
  await app.listen(Number(process.env.PORT) || 3000)

  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TagsModule } from './tags/tags.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        dbName: configService.get('MONGODB_DATABASE'),
        auth: {
          username: configService.get('MONGODB_USER'),
          password: configService.get('MONGODB_PASSWORD'),
        },
      }),
    }),
    TagsModule,
  ],
})
export class AppModule {}

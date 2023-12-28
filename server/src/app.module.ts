import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    CatsModule,
  ],
})
export class AppModule {}

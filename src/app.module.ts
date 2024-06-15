import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    FilesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

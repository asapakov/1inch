import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

const config = () => ({
  minio: {
    endPoint: process.env.MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [config],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}

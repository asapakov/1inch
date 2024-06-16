/**
 * Module for configuring application-wide settings using environment variables.
 *
 * This module uses `ConfigModule` from `@nestjs/config` to load environment variables
 * from a specified `.env` file and provide a centralized configuration object.
 * It defines configurations for MinIO and MongoDB connections based on environment variables.
 * The `@Global()` decorator ensures that this module is available application-wide.
 */
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Configuration function to load environment variables and define configurations
const config = () => ({
  minio: {
    endPoint: process.env.MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
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

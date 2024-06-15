import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const endPoint: string = this.configService.get<string>('minio.endPoint');
    const accessKey: string = this.configService.get<string>('minio.accessKey');
    const secretKey: string = this.configService.get<string>('minio.secretKey');
    this.client = new Client({
      endPoint,
      port: 9000,
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  getClient(): Client {
    return this.client;
  }

  async createBucketIfNotExists(bucketName: string): Promise<void> {
    const exists: boolean = await this.client.bucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName, 'us-east-1');
    }
  }
}

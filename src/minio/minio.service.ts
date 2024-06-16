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

  /**
   * Retrieves the MinIO client instance.
   *
   * @returns {Client} - The MinIO client instance used to interact with the MinIO server.
   *
   * This method returns the configured MinIO client instance stored within the class.
   * It provides access to functionalities for interacting with the MinIO server,
   * such as uploading, downloading, and deleting objects.
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Creates a new bucket in the MinIO server if it does not already exist.
   *
   * @param {string} bucketName - The name of the bucket to create.
   * @returns {Promise<void>} - A promise that resolves when the bucket is successfully created or already exists.
   *
   * This method checks if the specified bucket exists on the MinIO server.
   * If the bucket does not exist, it creates a new bucket with the provided name in the 'us-east-1' region.
   */
  async createBucketIfNotExists(bucketName: string): Promise<void> {
    const exists: boolean = await this.client.bucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName, 'us-east-1');
    }
  }
}

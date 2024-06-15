import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class FilesService {
  private readonly bucketName: string;
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('minio.bucketName');
    this.minioService.createBucketIfNotExists(this.bucketName);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const client: Client = this.minioService.getClient();

    const fileExt: string = path.extname(file.originalname);
    const fileName: string = `${uuid()}${fileExt}`;
    const filePath: string = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      fileName,
    );
    await fs.promises.writeFile(filePath, file.buffer);

    await client.putObject(this.bucketName, fileName, filePath);
    await fs.promises.unlink(filePath);

    return fileName;
  }

  async getFile(version: string): Promise<Buffer> {
    const client: Client = this.minioService.getClient();

    try {
      const stream = await client.getObject(this.bucketName, version);

      const data: Buffer[] = [];
      for await (const chunk of stream) {
        data.push(chunk);
      }
      return Buffer.concat(data);
    } catch (error) {
      console.error(`Error retrieving file '${version}' from Minio:`, error);
      throw new NotFoundException(`File version '${version}' not found`);
    }
  }

  async deleteFile(version: string): Promise<void> {
    const client: Client = this.minioService.getClient();

    await client.removeObject(this.bucketName, version);
  }
}

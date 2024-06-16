import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '../minio/minio.service';
import { FileHistoryService } from './history/file-history.service';

@Injectable()
export class FilesService {
  private readonly bucketName: string;

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    private readonly fileHistoryService: FileHistoryService,
  ) {
    // getting variables from config
    this.bucketName = this.configService.get('minio.bucketName');
    this.minioService
      .createBucketIfNotExists(this.bucketName)
      .catch(console.error);
  }

  /**
   * Uploads a file to the MinIO server and logs the upload event.
   *
   * @param {Express.Multer.File} file - The file to be uploaded.
   * @param {number} userId - The ID of the user uploading the file.
   * @returns {Promise<string>} - A promise that resolves to the unique file name of the uploaded file.
   *
   * The function performs the following steps:
   * 1. Generates a unique file name using a UUID and the original file extension.
   * 2. Ensures the local upload directory exists, creating it if necessary.
   * 3. Writes the file buffer to a temporary location on disk.
   * 4. Uploads the file from the temporary location to the MinIO server.
   * 5. Deletes the temporary file from disk.
   * 6. Logs the file creation event with the user ID.
   * 7. Returns the unique file name of the uploaded file.
   */
  async uploadFile(file: Express.Multer.File, userId: number): Promise<string> {
    const client: Client = this.minioService.getClient();

    const fileExt: string = path.extname(file.originalname);
    const fileName: string = `${uuid()}${fileExt}`;

    const uploadDir: string = path.join(__dirname, '..', '..', 'uploads');
    const filePath: string = path.join(uploadDir, fileName);

    await fs.promises.mkdir(uploadDir, { recursive: true });

    await fs.promises.writeFile(filePath, file.buffer);

    await client.putObject(this.bucketName, fileName, filePath);

    await fs.promises.unlink(filePath);

    await this.fileHistoryService.logFileCreated(fileName, userId);
    return fileName;
  }

  /**
   * Retrieves a file from the MinIO server by its version.
   *
   * @param {string} version - The version (or unique identifier) of the file to retrieve.
   * @returns {Promise<Buffer>} - A promise that resolves to a Buffer containing the file data.
   *
   * The function performs the following steps:
   * 1. Uses the MinIO client to request the file as a stream.
   * 2. Reads the stream data in chunks and accumulates these chunks into a Buffer array.
   * 3. Concatenates the chunks into a single Buffer and returns it.
   * 4. If an error occurs during file retrieval, logs the error and throws a NotFoundException.
   *
   * @throws {NotFoundException} - If the file with the specified version is not found on the MinIO server.
   */
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

  /**
   * Deletes a file from the MinIO server and logs the deletion event.
   *
   * @param {string} version - The version (or unique identifier) of the file to delete.
   * @param {number} userId - The ID of the user who is deleting the file.
   * @returns {Promise<void>} - A promise that resolves when the file has been deleted and the deletion event logged.
   *
   * The function performs the following steps:
   * 1. Logs the file deletion event with the user ID.
   * 2. Uses the MinIO client to delete the file from the MinIO storage.
   */
  async deleteFile(version: string, userId: number): Promise<void> {
    const client: Client = this.minioService.getClient();
    await this.fileHistoryService.logFileDeleted(version, userId);

    await client.removeObject(this.bucketName, version);
  }
}

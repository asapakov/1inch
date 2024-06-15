import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileHistory } from './file-history.schema';

@Injectable()
export class FileHistoryService {
  constructor(
    @InjectModel('FileHistory')
    private readonly fileHistoryModel: Model<FileHistory>,
  ) {}

  async logFileCreated(version: string, userId: number): Promise<FileHistory> {
    const createdLog = new this.fileHistoryModel({
      version,
      userId,
      action: 'created',
    });
    return createdLog.save();
  }

  async logFileDeleted(version: string, userId: number): Promise<FileHistory> {
    const deletedLog = new this.fileHistoryModel({
      version,
      userId,
      action: 'deleted',
    });
    return deletedLog.save();
  }
}

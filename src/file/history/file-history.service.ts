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

  /**
   * Logs the creation of a file by creating a new entry in the file history.
   *
   * @param {string} version - The version (or unique identifier) of the file.
   * @param {number} userId - The ID of the user who created the file.
   * @returns {Promise<FileHistory>} - A promise that resolves to the saved file history log entry.
   *
   * The function creates a new file history log entry with the specified file version and user ID,
   * marking the action as 'created'. The log entry is then saved to the database.
   */
  async logFileCreated(version: string, userId: number): Promise<FileHistory> {
    const createdLog = new this.fileHistoryModel({
      version,
      userId,
      action: 'created',
    });
    return createdLog.save();
  }

  /**
   * Logs the deletion of a file by creating a new entry in the file history.
   *
   * @param {string} version - The version (or unique identifier) of the file.
   * @param {number} userId - The ID of the user who deleted the file.
   * @returns {Promise<FileHistory>} - A promise that resolves to the saved file history log entry.
   *
   * The function creates a new file history log entry with the specified file version and user ID,
   * marking the action as 'deleted'. The log entry is then saved to the database.
   */
  async logFileDeleted(version: string, userId: number): Promise<FileHistory> {
    const deletedLog = new this.fileHistoryModel({
      version,
      userId,
      action: 'deleted',
    });
    return deletedLog.save();
  }
}

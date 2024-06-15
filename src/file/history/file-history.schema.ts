import * as mongoose from 'mongoose';

export const FileHistorySchema = new mongoose.Schema({
  version: { type: String, required: true },
  action: {
    type: String,
    enum: ['created', 'deleted'],
    required: true,
  },
  userId: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface FileHistory extends mongoose.Document {
  version: string;
  action: 'created' | 'deleted';
  userId: number;
  timestamp: Date;
}

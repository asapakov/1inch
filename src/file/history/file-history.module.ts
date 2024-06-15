import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileHistorySchema } from './file-history.schema';
import { FileHistoryService } from './file-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FileHistory', schema: FileHistorySchema },
    ]),
  ],
  providers: [FileHistoryService],
  exports: [FileHistoryService],
})
export class FileHistoryModule {}

import { Module } from '@nestjs/common';
import { FilesService } from './file.service';
import { FilesController } from './file.controller';
import { MinioModule } from '../minio/minio.module';
import { FileHistoryModule } from './history/file-history.module';

@Module({
  imports: [MinioModule, FileHistoryModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

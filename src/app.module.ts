import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './file/file.module';

@Module({
  imports: [ConfigurationModule, AuthModule, FilesModule],
})
export class AppModule {}

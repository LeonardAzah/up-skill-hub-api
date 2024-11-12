import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './config/cloudinary.config';
import { CommonModule } from 'common/common.module';
import { APP_FILTER } from '@nestjs/core';
import { FilesExceptionFilter } from './files/exception-filters/files-exception/files-exception.filter';
import { ConfigModule } from 'common';

@Module({
  imports: [CommonModule, ConfigModule],
  providers: [
    CloudinaryService,
    CloudinaryProvider,
    { provide: APP_FILTER, useClass: FilesExceptionFilter },
  ],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}

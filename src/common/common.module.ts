import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from './utils';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { QueryingModule } from './querying/querying.module';
import { LoggerModule } from './logger/logger.module';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
    { provide: HashingService, useClass: BcryptService },
  ],
  imports: [ConfigModule, DatabaseModule, QueryingModule, LoggerModule],
  exports: [HashingService],
})
export class CommonModule {}

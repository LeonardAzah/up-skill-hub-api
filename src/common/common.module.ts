import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from './utils';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { QueryingModule } from './querying/querying.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
  ],
  imports: [ConfigModule, DatabaseModule, QueryingModule],
})
export class CommonModule {}

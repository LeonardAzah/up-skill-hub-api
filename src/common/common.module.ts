import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from './utils';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { QueryingModule } from './querying/querying.module';
import { LoggerModule } from './logger/logger.module';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
    },
    { provide: HashingService, useClass: BcryptService },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    ConfigModule,
    DatabaseModule,
    QueryingModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
  ],
  exports: [HashingService],
})
export class CommonModule {}

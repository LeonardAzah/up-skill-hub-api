import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'common';

@Module({
  imports: [UsersModule, CommonModule, AuthModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

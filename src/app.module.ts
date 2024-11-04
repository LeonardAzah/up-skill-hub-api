import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'common';
import { CourseModule } from './domain/course/course.module';

@Module({
  imports: [UsersModule, CommonModule, AuthModule, LoggerModule, CourseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

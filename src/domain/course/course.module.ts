import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseModule, QueryingModule } from 'common';
import { CommonModule } from 'common/common.module';
import { User } from 'users/entities/user.entity';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    CommonModule,
    DatabaseModule.forFeature([User]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

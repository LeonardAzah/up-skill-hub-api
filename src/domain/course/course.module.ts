import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseModule, QueryingModule } from 'common';
import { CommonModule } from 'common/common.module';
import { User } from 'users/entities/user.entity';
import { Course } from './entities/course.entity';
import { CourseRepository } from './course.repository';
import { Category } from 'category/entities/category.entity';
import { UsersModule } from 'users/users.module';
import { CategoryModule } from 'category/category.module';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    UsersModule,
    CategoryModule,
    CommonModule,
    DatabaseModule.forFeature([Course, User, Category]),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}

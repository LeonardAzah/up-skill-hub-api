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
import { CourseSubscriber } from './subscribers/course.subscriber';
import { LessonsRepository } from './lessons/lesson.repository';
import { Section } from './entities/section.entity';
import { Lesson } from './entities/lesson.entity';
import { SectionsService } from './sections/sections.service';
import { LessonsService } from './lessons/lessons.service';
import { SectionsRepository } from './sections/section.repository';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    UsersModule,
    CategoryModule,
    CommonModule,
    DatabaseModule.forFeature([Course, User, Category, Section, Lesson]),
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    CourseRepository,
    CourseSubscriber,
    SectionsRepository,
    LessonsRepository,
    SectionsService,
    LessonsService,
  ],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}

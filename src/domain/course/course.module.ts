import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { ConfigModule, DatabaseModule, QueryingModule } from 'common';
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
import { SectionsSubscriber } from './subscribers/section.subscriber';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { SectionsController } from './sections/sections.controller';
import { LessonsController } from './lessons/lessons.controller';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    UsersModule,
    CategoryModule,
    CommonModule,
    ConfigModule,
    CloudinaryModule,
    DatabaseModule.forFeature([Course, User, Category, Section, Lesson]),
  ],
  controllers: [CourseController, SectionsController, LessonsController],
  providers: [
    CourseService,
    CourseRepository,
    CourseSubscriber,
    SectionsSubscriber,
    SectionsRepository,
    LessonsRepository,
    SectionsService,
    LessonsService,
  ],
  exports: [CourseService, CourseRepository, SectionsService, LessonsService],
})
export class CourseModule {}

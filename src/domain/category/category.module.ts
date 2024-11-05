import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule, QueryingModule } from 'common';
import { CommonModule } from 'common/common.module';
import { User } from 'users/entities/user.entity';
import { Course } from 'course/entities/course.entity';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    CommonModule,
    DatabaseModule.forFeature([Category, User, Course]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}

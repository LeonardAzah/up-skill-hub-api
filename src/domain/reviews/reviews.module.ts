import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { CommonModule } from 'common/common.module';
import { DatabaseModule, QueryingModule } from 'common';
import { UsersModule } from 'users/users.module';
import { CourseModule } from 'course/course.module';
import { Review } from './entities/review.entity';
import { User } from 'users/entities/user.entity';
import { Course } from 'course/entities/course.entity';
import { ReviewsRepository } from './reviews.repository';

@Module({
  imports: [
    CommonModule,
    QueryingModule,
    UsersModule,
    CourseModule,
    DatabaseModule,
    DatabaseModule.forFeature([Review, User, Course]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}

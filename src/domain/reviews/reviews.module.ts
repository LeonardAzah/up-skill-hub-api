import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { CommonModule } from 'common/common.module';
import { DatabaseModule } from 'common';
import { UsersModule } from 'users/users.module';
import { CourseModule } from 'course/course.module';
import { Review } from './entities/review.entity';
import { User } from 'users/entities/user.entity';
import { Course } from 'course/entities/course.entity';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    CourseModule,
    DatabaseModule,
    DatabaseModule.forFeature([Review, User, Course]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

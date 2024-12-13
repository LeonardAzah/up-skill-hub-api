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
import { ReviewEventListernerService } from './review-event-listerner.service';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    CommonModule,
    QueryingModule,
    UsersModule,
    CourseModule,
    NotificationsModule,
    DatabaseModule,
    DatabaseModule.forFeature([Review, User, Course]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository, ReviewEventListernerService],
})
export class ReviewsModule {}

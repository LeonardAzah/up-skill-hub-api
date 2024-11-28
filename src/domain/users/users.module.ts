import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.reposisoty';
import { ConfigModule, DatabaseModule, QueryingModule } from 'common';
import { User } from './entities/user.entity';
import { CommonModule } from 'common/common.module';
import { UsersSubscriber } from './subscribers/users.subscribers';
import { Category } from 'category/entities/category.entity';
import { Course } from 'course/entities/course.entity';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { Cart } from 'cart/entities/cart.entity';
import { UserEventListernerService } from './user-event-listerner.service';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    CommonModule,
    CloudinaryModule,
    NotificationsModule,
    ConfigModule,
    DatabaseModule.forFeature([User, Category, Course, Cart]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersSubscriber,
    UserEventListernerService,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

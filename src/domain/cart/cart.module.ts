import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CommonModule } from 'common/common.module';
import { DatabaseModule } from 'common';
import { Course } from 'course/entities/course.entity';
import { Cart } from './entities/cart.entity';
import { User } from 'users/entities/user.entity';
import { CartsRepository } from './cart.repository';
import { CartItemsRepository } from './cart-item.repository';
import { CartItem } from './entities/cart-item.entity';
import { UsersModule } from 'users/users.module';
import { CourseModule } from 'course/course.module';
import { PaymentsModule } from 'payments/payments.module';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    UsersModule,
    CourseModule,
    PaymentsModule,
    NotificationsModule,
    DatabaseModule.forFeature([Cart, CartItem, Course, User]),
  ],
  controllers: [CartController],
  providers: [CartService, CartsRepository, CartItemsRepository],
  exports: [CartService],
})
export class CartModule {}

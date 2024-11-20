import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'common';
import { CourseModule } from './domain/course/course.module';
import { CategoryModule } from './domain/category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PaymentsModule } from './domain/payments/payments.module';
import { CartModule } from './domain/cart/cart.module';
import { NotificationsModule } from './domain/notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    AuthModule,
    LoggerModule,
    CourseModule,
    CategoryModule,
    CloudinaryModule,
    PaymentsModule,
    CartModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

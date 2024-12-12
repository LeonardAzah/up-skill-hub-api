import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule, DatabaseModule } from 'common';
import { CommonModule } from 'common/common.module';
import { firebaseAdminProvider } from './firebase-admin.provider';
import { Notification } from './entities/notification.entity';
import { User } from 'users/entities/user.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    DatabaseModule,
    DatabaseModule.forFeature([Notification, User]),
  ],
  controllers: [NotificationsController],
  providers: [
    firebaseAdminProvider,
    NotificationsService,
    NotificationsRepository,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}

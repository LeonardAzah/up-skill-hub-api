import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from 'common';
import { CommonModule } from 'common/common.module';
import { firebaseAdminProvider } from './firebase-admin.provider';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [CommonModule, ConfigModule],
  controllers: [NotificationsController],
  providers: [firebaseAdminProvider, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

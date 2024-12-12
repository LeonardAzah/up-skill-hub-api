import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent(user: User) {
    const title = 'Welcome to the Platform!';
    const body = `Hi ${user.name}, thank you for registering on our platform. Start exploring courses now!`;

    await this.notificationsService.notifyEmail(user.email, body, title);

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('user.registered')
  async handleUserRecoveredEvent(user: User) {
    const title = 'Welcome back!';
    const body = `Hi ${user.name}, your account ahs been recovered successfully`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }
}

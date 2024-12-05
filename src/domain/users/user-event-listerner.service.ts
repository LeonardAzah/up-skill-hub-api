import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { EmitterPayload } from './interfaces/user-emitter-payload.interface';

@Injectable()
export class UserEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent({ name, token, email }: EmitterPayload) {
    const title = 'Welcome to the Platform!';
    const body = `Hi ${name}, thank you for registering on our platform. Start exploring courses now!`;

    await this.notificationsService.notifyEmail(email, body, title);

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('user.registered')
  async handleUserRecoveredEvent({ name, token }: EmitterPayload) {
    const title = 'Welcome back!';
    const body = `Hi ${name}, your account ahs been recovered successfully`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }
}

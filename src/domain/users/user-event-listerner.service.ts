import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { User } from './entities/user.entity';
import { EmitterPayload } from './interfaces/user-emitter-payload.interface';

@Injectable()
export class UserEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent({ name, token }: EmitterPayload) {
    const title = 'Welcome to the Platform!';
    const body = `Hi ${name}, thank you for registering on our platform. Start exploring courses now!`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }
}

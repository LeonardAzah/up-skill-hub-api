import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ForgotPasswordEmitterPayload } from 'auth/interfaces/forgot-password.interface';
import { NotificationsService } from 'notifications/notifications.service';
import { User } from 'users/entities/user.entity';

@Injectable()
export class AuthEventListernerService {
  constructor(private readonly notificationsSevice: NotificationsService) {}
  @OnEvent('forgot.password')
  async handleUserRegisteredEvent({
    name,
    email,
    otp,
  }: ForgotPasswordEmitterPayload) {
    const title = 'Forgot Password';
    const body = `Hello, ${name}\nUse this code to reset your password: ${otp}`;

    await this.notificationsSevice.notifyEmail(email, body, title);
  }
}

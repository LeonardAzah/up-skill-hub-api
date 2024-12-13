import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PurchaseEmitter } from 'cart/interfaces/purchase-emitter.intrfaces';
import e from 'express';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class PurcahseEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('purchase.course')
  async handlePurchaseCourseEvent({ text, user }: PurchaseEmitter) {
    const subject = 'Purchase Confirmation';

    await this.notificationsService.notifyEmail(user.email, text, subject);

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title: subject,
        body: text,
      });
    }
  }
}

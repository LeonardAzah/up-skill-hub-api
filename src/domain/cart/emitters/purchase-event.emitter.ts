import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PurchaseEmitter } from 'cart/interfaces/purchase-emitter.intrfaces';
import e from 'express';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class PurcahseEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('purchase.course')
  async handlePurchaseCourseEvent({ text, email, token }: PurchaseEmitter) {
    const subject = 'Purchase Confirmation';

    await this.notificationsService.notifyEmail(email, text, subject);

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title: subject,
        body: text,
      });
    }
  }
}

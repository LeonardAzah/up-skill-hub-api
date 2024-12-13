import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { ReviewEmitterPayload } from './interfaces/review-emitter-payload.interfaces';

@Injectable()
export class ReviewEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('student.reviewed')
  async handleUserReviewEvent({
    user,
    courseTitle,
    ratings,
  }: ReviewEmitterPayload) {
    const title = 'Student made a review';
    const body = `${user.name}, has reviewed on your course ${courseTitle} with a rating of ${ratings}`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('student.reviewed.updated')
  async handleUserReviewUpdateEvent({
    user,
    courseTitle,
    ratings,
  }: ReviewEmitterPayload) {
    const title = 'Student made a review';
    const body = `${user.name}, has updated their reviewed on your course ${courseTitle} with a rating of ${ratings}`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }
}

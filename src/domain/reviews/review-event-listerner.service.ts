import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { ReviewEmitterPayload } from './interfaces/review-emitter-payload.interfaces';

@Injectable()
export class ReviewEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('student.reviewed')
  async handleUserReviewEvent({
    name,
    token,
    courseTitle,
    ratings,
  }: ReviewEmitterPayload) {
    const title = 'Student made a review';
    const body = `${name}, has reviewed on your course ${courseTitle} with a rating of ${ratings}`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('student.reviewed.updated')
  async handleUserReviewUpdateEvent({
    name,
    token,
    courseTitle,
    ratings,
  }: ReviewEmitterPayload) {
    const title = 'Student made a review';
    const body = `${name}, has updated their reviewed on your course ${courseTitle} with a rating of ${ratings}`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }
}

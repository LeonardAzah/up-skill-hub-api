import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { CourseEmitterPayload } from './interfaces/course-emitter-payload.interfaces';

@Injectable()
export class CourseEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('course.created')
  async handleCourseCreatedEvent({ user, courseTitle }: CourseEmitterPayload) {
    const title = 'Course created';
    const body = `You created a course with title ${courseTitle}`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('course.removed')
  async handleCourseRemoveEvent({ user, courseTitle }: CourseEmitterPayload) {
    const title = 'Course removed';
    const body = `You removed the course with title ${courseTitle}`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('course.thumbnail.updated')
  async handleUploadThumbnailEvent({
    user,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'Uploaded thumbnail';
    const body = `Thumbnail for the course ${courseTitle} has been updated`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('student.enrolled')
  async handleEnrolledToCourseEvent({
    user,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'New Enrollment in Your Course';
    const body = `${user.name} has enrolled in your course "${courseTitle}`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }

  @OnEvent('course.enrolled')
  async handleStudentEnrolledToCourseEvent({
    user,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'Enrollment Successful';
    const body = `You have successfully enrolled in the course "${courseTitle}"`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }
  @OnEvent('course.status.updated')
  async handleCourseStatusEvent({ user, courseTitle }: CourseEmitterPayload) {
    const title = 'Enrollment Successful';
    const body = `You have successfully enrolled in the course "${courseTitle}"`;

    if (user?.fcmToken) {
      await this.notificationsService.sendPushNotification({
        user,
        title,
        body,
      });
    }
  }
}

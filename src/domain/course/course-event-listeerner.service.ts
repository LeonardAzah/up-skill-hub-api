import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'notifications/notifications.service';
import { CourseEmitterPayload } from './interfaces/course-emitter-payload.interfaces';

@Injectable()
export class CourseEventListernerService {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('course.created')
  async handleCourseCreatedEvent({ token, courseTitle }: CourseEmitterPayload) {
    const title = 'Course created';
    const body = `You created a course with title ${courseTitle}`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('course.removed')
  async handleCourseRemoveEvent({ token, courseTitle }: CourseEmitterPayload) {
    const title = 'Course removed';
    const body = `You removed the course with title ${courseTitle}`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('course.thumbnail.updated')
  async handleUploadThumbnailEvent({
    token,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'Uploaded thumbnail';
    const body = `Thumbnail for the course ${courseTitle} has been updated`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('student.enrolled')
  async handleEnrolledToCourseEvent({
    token,
    name,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'New Enrollment in Your Course';
    const body = `${name} has enrolled in your course "${courseTitle}`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }

  @OnEvent('course.enrolled')
  async handleStudentEnrolledToCourseEvent({
    token,
    courseTitle,
  }: CourseEmitterPayload) {
    const title = 'Enrollment Successful';
    const body = `You have successfully enrolled in the course "${courseTitle}"`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }
  @OnEvent('course.status.updated')
  async handleCourseStatusEvent({ token, courseTitle }: CourseEmitterPayload) {
    const title = 'Enrollment Successful';
    const body = `You have successfully enrolled in the course "${courseTitle}"`;

    if (token) {
      await this.notificationsService.sendPushNotification({
        token,
        title,
        body,
      });
    }
  }
}

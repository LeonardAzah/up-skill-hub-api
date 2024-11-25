import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { sendNotificationDTO } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post()
  sendNotification(@Body() pushNotification: sendNotificationDTO) {
    this.notificationService.sendPush(pushNotification);
  }
}

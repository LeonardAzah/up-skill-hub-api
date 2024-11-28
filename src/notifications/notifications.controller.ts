import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { Public } from 'common';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Public()
  @Post()
  sendNotification(@Body() pushNotification: SendNotificationDTO) {
    this.notificationService.sendPushNotification(pushNotification);
  }
}

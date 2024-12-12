import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser, IdDto, RequestUser } from 'common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  async getUserNotification(@CurrentUser() { id }: RequestUser) {
    return this.notificationService.getUserNotifications(id);
  }

  @Patch(':id')
  async markAsRead(@Param() { id }: IdDto, @CurrentUser() user: RequestUser) {
    return this.notificationService.markAsRead(user.id, id);
  }

  @Patch('mark-all')
  async markAllAsRead(@CurrentUser() { id }: IdDto) {
    return this.notificationService.markAllAsRead(id);
  }

  @Delete()
  async clearNotifications(@CurrentUser() { id }: IdDto) {
    return this.notificationService.clearNotifications(id);
  }
}

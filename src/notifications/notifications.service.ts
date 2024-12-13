import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as firebase from 'firebase-admin';
import { NotificationsRepository } from './notifications.repository';
import { Notification } from './entities/notification.entity';
import { SendNotification } from './interfaces/send-notification.interfaces';

@Injectable()
export class NotificationsService {
  protected readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationRepository: NotificationsRepository,
  ) {}

  async sendPushNotification({ user, title, body }: SendNotification) {
    try {
      await firebase
        .messaging()
        .send({
          notification: {
            title,
            body,
          },
          token: user.fcmToken,
          data: {},
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'default',
            },
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                contentAvailable: true,
                sound: 'default',
              },
            },
          },
        })
        .catch((error: any) => {
          this.logger.error(error);
        });

      const newNotification = new Notification({ user, title, body });
      await this.notificationRepository.save(newNotification);
    } catch (error) {
      this.logger.error(error);

      throw new Error('Unable to send push notification');
    }
  }

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail(email: string, text: string, subject: string) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject,
      text,
    });
  }

  async getUserNotifications(id: string) {
    return this.notificationRepository.find({
      where: { user: { id } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(id: string) {
    await this.notificationRepository.findOneAndUpdate(
      { user: { id }, isRead: false },
      { isRead: true },
    );
    return { msg: 'All notifications marked as read' };
  }

  async clearNotifications(id: string) {
    await this.notificationRepository.delete({ user: { id } });
    return { msg: 'All notifications cleared' };
  }
}

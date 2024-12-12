import { User } from 'users/entities/user.entity';

export interface SendNotification {
  title: string;

  body: string;

  user: User;
}

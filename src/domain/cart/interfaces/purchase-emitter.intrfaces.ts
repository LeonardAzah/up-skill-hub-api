import { User } from 'users/entities/user.entity';

export interface PurchaseEmitter {
  text: string;
  user: User;
}

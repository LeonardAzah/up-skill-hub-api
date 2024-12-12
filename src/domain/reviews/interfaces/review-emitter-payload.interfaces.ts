import { User } from 'users/entities/user.entity';

export interface ReviewEmitterPayload {
  courseTitle: string;
  ratings: number;
  user: User;
}

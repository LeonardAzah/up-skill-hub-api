import { User } from 'users/entities/user.entity';

export interface CourseEmitterPayload {
  courseTitle: string;
  user: User;
}

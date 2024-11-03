import { Role } from 'auth/roles/enums/roles.enum';

export interface RefreshUser {
  readonly id: string;
  readonly role: Role;
  readonly email: string;
  readonly refreshToken: string;
}

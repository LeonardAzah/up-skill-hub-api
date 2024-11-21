import { Role } from 'common/enums/roles.enum';

export interface RefreshUser {
  readonly id: string;
  readonly role: Role;
  readonly email: string;
  readonly refreshToken: string;
}

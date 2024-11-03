import { Role } from 'auth/roles/enums/roles.enum';

export interface RequestUser {
  readonly id: string;
  readonly role: Role;
  readonly email: string;
}

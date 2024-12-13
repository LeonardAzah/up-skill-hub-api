import { Role } from 'common/enums/roles.enum';

export interface RequestUser {
  readonly id: string;
  readonly role: Role;
  readonly email: string;
}

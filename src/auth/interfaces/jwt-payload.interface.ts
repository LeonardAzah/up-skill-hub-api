import { Role } from 'auth/roles/enums/roles.enum';

export interface JwtPayload {
  readonly sub: string;
  readonly role: Role;
  readonly email: string;
}

import { SetMetadata } from '@nestjs/common';
import { NonEmptyArray, Role } from 'common';

export const ROLES_KEY = 'role';

export const Roles = (...roles: NonEmptyArray<Role>) =>
  SetMetadata(ROLES_KEY, roles);

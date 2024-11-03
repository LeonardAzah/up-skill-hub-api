import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles/enums/roles.enum';
import { NonEmptyArray } from 'common';

export const ROLES_KEY = 'role';

export const Roles = (...roles: NonEmptyArray<Role>) =>
  SetMetadata(ROLES_KEY, roles);

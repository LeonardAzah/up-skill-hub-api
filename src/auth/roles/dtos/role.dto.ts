import { IsEnum } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class RoleDto {
  @IsEnum(Role)
  readonly role: Role;
}

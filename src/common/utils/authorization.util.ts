import { ForbiddenException } from '@nestjs/common';
import { RequestUser } from '../interfaces/request-user.interface';
import { Role } from '../enums/roles.enum';

export const compareUserId = async (
  currentUser: RequestUser,
  requiredId: string,
) => {
  if (currentUser.role !== Role.ADMIN) {
    if (currentUser.id !== requiredId) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
};

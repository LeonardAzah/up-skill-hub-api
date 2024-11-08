import { ForbiddenException } from '@nestjs/common';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { Role } from '../../auth/roles/enums/roles.enum';

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

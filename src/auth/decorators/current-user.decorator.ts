import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'users/entities/user.entity';

// const getCurrentUserByContext = (context: ExecutionContext): User => {
//   return context.switchToHttp().getRequest().user;
// };
// export const CurrentUser = createParamDecorator(
//   (_data: unknown, context: ExecutionContext) =>
//     getCurrentUserByContext(context),
// );

const getCurrentUserByContext = (
  context: ExecutionContext,
): User | undefined => {
  const request = context.switchToHttp().getRequest();
  return request.user; // Ensure this matches where Passport attaches the user
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

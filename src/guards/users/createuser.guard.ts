import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { user_role } from '@prisma/client';

@Injectable()
export class CreateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === user_role.USER) {
      return false;
    }
    return true;
  }
}

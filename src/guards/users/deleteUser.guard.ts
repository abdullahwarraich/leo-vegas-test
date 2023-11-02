import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { user_role } from '@prisma/client';

@Injectable()
export class DeleteUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user;
    if (Number(id) === user.id || user.role === user_role.USER) {
      return false;
    }
    return true;
  }
}

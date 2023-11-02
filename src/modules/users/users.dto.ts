import { Users, user_role } from '@prisma/client';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: user_role;
}

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly role?: user_role;
}

export type UserDto = Pick<Users, 'id' | 'name' | 'email' | 'role'>;

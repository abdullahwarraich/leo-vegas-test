import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const mapUser = (users: Users) => ({
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
});

export const passwordEncryption = async (password: string) =>
  bcrypt.hash(password, saltRounds);

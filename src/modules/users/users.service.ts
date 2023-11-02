import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { passwordEncryption, mapUser } from '../../utils';
import { UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE } from '../../utils/constants';
import { PrismaService } from '../../services/prisma.service';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // list all users
  async getUsers(): Promise<UserDto[]> {
    const users = await this.prisma.users.findMany();
    return users.map(mapUser);
  }

  // get user by id
  async getUserById(id: number): Promise<UserDto> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return mapUser(user);
  }

  // create user
  async createUser(userInput: Prisma.UsersCreateInput): Promise<UserDto> {
    try {
      const data = {
        ...userInput,
        password: await passwordEncryption(userInput.password),
      };
      const createdUser = await this.prisma.users.create({
        data,
      });
      return mapUser(createdUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE,
          );
        }
      }
      throw new BadRequestException(error);
    }
  }

  // update user
  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    userInput: Prisma.UsersUpdateInput;
  }): Promise<UserDto> {
    try {
      const { where, userInput } = params;

      const data = userInput.password
        ? {
            ...userInput,
            password: await passwordEncryption(userInput?.password as string),
          }
        : userInput;

      const updatedUser = await this.prisma.users.update({
        data,
        where,
      });
      return mapUser(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE,
          );
        }
      }
      throw new BadRequestException(error);
    }
  }

  //delete user
  async deleteUser(params: {
    where: Prisma.UsersWhereUniqueInput;
  }): Promise<UserDto> {
    const { where } = params;
    const deletedUser = await this.prisma.users
      .delete({
        where,
      })
      .catch(() => {
        throw new NotFoundException(`Can't find user with id ${where.id}`);
      });

    return mapUser(deletedUser);
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { user_role } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import {
  UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE,
  USER_NOT_EXIST_ERROR_MESSAGE,
} from '../../utils/constants';

const users: UserDto[] = [
  {
    id: 1,
    name: 'Test User1',
    email: 'testuser1@test.com',
    role: user_role.ADMIN,
  },
  {
    id: 2,
    name: 'Test User2',
    email: 'testuser2@test.com',
    role: user_role.USER,
  },
  {
    id: 3,
    name: 'Test User3',
    email: 'testuser3@test.com',
    role: user_role.USER,
  },
];

describe('UserController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('modules initialization check', () => {
    it('should define user controller', () => {
      expect(usersController).toBeDefined();
    });

    it('should define user service', () => {
      expect(usersService).toBeDefined();
    });
  });

  describe('getUsers route', () => {
    it('should retrieve all users', async () => {
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(users);
      expect(await usersController.getUsers()).toEqual(users);
    });
  });

  describe('getUserById route', () => {
    it('should retrieve a user by their user ID', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValue(users[1]);

      expect(await usersController.getUserById(users[1].id)).toEqual(users[1]);
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        throw new NotFoundException(USER_NOT_EXIST_ERROR_MESSAGE);
      });
      await expect(usersController.getUserById(444)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create user route', () => {
    it('should successfully create a new user', async () => {
      const { id, ...userInfo } = users[0];
      const createUserInfo = {
        ...userInfo,
        password: 'test1',
      };
      jest.spyOn(usersService, 'createUser').mockResolvedValue(users[0]);
      expect(await usersController.createUser(createUserInfo)).toEqual(
        users[0],
      );
    });

    it('should throw a BadRequestException as the email alreay exist', async () => {
      const { id, ...userInfo } = users[0];
      const createUserInfo = {
        ...userInfo,
        password: 'test1',
      };
      jest.spyOn(usersService, 'createUser').mockImplementation(() => {
        throw new BadRequestException(
          UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE,
        );
      });

      try {
        await usersController.createUser(createUserInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE);
      }
    });
  });

  describe('update user route', () => {
    it('should update user', async () => {
      const updateUserInfo = {
        email: 'testuser11@test.com',
      };
      const userInfo = {
        ...users[0],
        email: 'testuser11@test.com',
      };

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(userInfo);
      expect(
        await usersController.updateUser(users[0].id, updateUserInfo),
      ).toEqual(userInfo);
    });

    it('should throw a BadRequestException as the email alreay exist', async () => {
      const updateUserInfo = {
        email: 'testuser11@test.com',
      };
      jest.spyOn(usersService, 'updateUser').mockImplementation(() => {
        throw new BadRequestException(
          UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE,
        );
      });

      try {
        await usersController.updateUser(users[0].id, updateUserInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(UNIQUE_CONSTRAINT_VIOLATION_ERROR_MESSAGE);
      }
    });
  });

  describe('delete user route', () => {
    it('should delete user', async () => {
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(users[0]);
      expect(await usersController.deleteUser(users[0].id)).toEqual(users[0]);
    });

    it('should throw a NotFoundException for user deletion', async () => {
      jest.spyOn(usersService, 'deleteUser').mockImplementation(() => {
        throw new NotFoundException('Can not find user with id');
      });
      try {
        await usersController.deleteUser(users[0].id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Can not find user with id');
      }
    });
  });
});

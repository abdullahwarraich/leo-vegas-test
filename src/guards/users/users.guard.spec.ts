import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { user_role } from '@prisma/client';
import {
  GetUsersGuard,
  GetUserGuard,
  CreateUserGuard,
  UpdateUserGuard,
  DeleteUserGuard,
} from '.';

describe('UserGuard', () => {
  let getUsersGuard: GetUsersGuard;
  let getUserGuard: GetUserGuard;
  let createUserGuard: CreateUserGuard;
  let updateUserGuard: UpdateUserGuard;
  let deleteUserGuard: DeleteUserGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersGuard,
        GetUserGuard,
        CreateUserGuard,
        UpdateUserGuard,
        DeleteUserGuard,
      ],
    }).compile();

    getUsersGuard = module.get<GetUsersGuard>(GetUsersGuard);
    getUserGuard = module.get<GetUserGuard>(GetUserGuard);
    createUserGuard = module.get<CreateUserGuard>(CreateUserGuard);
    updateUserGuard = module.get<UpdateUserGuard>(UpdateUserGuard);
    deleteUserGuard = module.get<DeleteUserGuard>(DeleteUserGuard);
  });

  describe('get all user guard', () => {
    it('should retrieve all users for the ADMIN role', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.ADMIN },
          }),
        }),
      } as ExecutionContext;

      const result = getUsersGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not retrieve all users for the USER role', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.USER },
          }),
        }),
      } as ExecutionContext;

      const result = getUsersGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });
  });

  describe('get user guard', () => {
    it('should allow users with the USER role to retrieve their own user information', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 1, role: user_role.USER },
            params: { id: 1 },
          }),
        }),
      } as ExecutionContext;

      const result = getUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not allow users with the USER role to retrieve other user information', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 1, role: user_role.USER },
            params: { id: 2 },
          }),
        }),
      } as ExecutionContext;

      const result = getUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should allow an ADMIN role to retrieve information of other users', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 1, role: user_role.ADMIN },
            params: { id: 2 },
          }),
        }),
      } as ExecutionContext;

      const result = getUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('create user guard', () => {
    it('should not allow creation of new users for the USER role', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.USER },
          }),
        }),
      } as ExecutionContext;

      const result = createUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should allow the creation of new users for the ADMIN role', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.ADMIN },
          }),
        }),
      } as ExecutionContext;

      const result = createUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('update user guard', () => {
    it('should allow users with the USER role to update their own information', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.USER, id: 1 },
            params: { id: 1 },
          }),
        }),
      } as ExecutionContext;

      const result = updateUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not allow users with the USER role from updating other user information', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.USER, id: 1 },
            params: { id: 2 },
          }),
        }),
      } as ExecutionContext;

      const result = updateUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it(`Should allow an ADMIN to update any other user's information`, () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.ADMIN, id: 1 },
            params: { id: 2 },
          }),
        }),
      } as ExecutionContext;

      const result = updateUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('delete user guard', () => {
    it('should not allow users with the USER role from deleting their own user profile', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.USER, id: 1 },
            params: { id: 1 },
          }),
        }),
      } as ExecutionContext;

      const result = deleteUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should not allow users with the ADMIN role to delete their own user profile', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.ADMIN, id: 1 },
            params: { id: 1 },
          }),
        }),
      } as ExecutionContext;

      const result = deleteUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should allow users with the ADMIN role to delete other users', () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: user_role.ADMIN, id: 1 },
            params: { id: 2 },
          }),
        }),
      } as ExecutionContext;

      const result = deleteUserGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });
});

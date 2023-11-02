import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../services/prisma.service';
import { JwtService } from '../../services/jwt.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [PrismaService, JwtService, UsersService, AuthService],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const mockAccessToken = 'mockedAccessToken';
      const mockUser = { email: 'test@example.com', password: 'password' };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => ({ accessToken: mockAccessToken }));

      const result = await controller.login(mockUser);

      expect(result).toEqual({ accessToken: mockAccessToken });
    });

    it('should handle errors if login fails', async () => {
      const mockUser = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(mockUser)).rejects.toThrowError(
        'Login failed',
      );
    });
  });
});

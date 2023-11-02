import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../services/prisma.service';
import { JwtService } from '../../services/jwt.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [PassportModule],
  providers: [JwtService, PrismaService, UsersService, AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}

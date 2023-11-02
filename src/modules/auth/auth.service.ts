import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../services/prisma.service';
import { JwtService } from '../../services/jwt.service';
import { UserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { USER_NOT_EXIST_ERROR_MESSAGE } from '../../utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  protected async validateUser(input: {
    email: string;
    password: string;
  }): Promise<UserDto> {
    const user = await this.prisma.users.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST_ERROR_MESSAGE);
    }

    const passwordVerify = await bcrypt.compare(input.password, user.password);

    if (!passwordVerify) {
      throw new BadRequestException('Incorrect password!');
    }
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }

  async login(user: { email: string; password: string }) {
    const payload = await this.validateUser(user);
    const accessToken = this.jwtService.generateToken(payload);

    await this.usersService.updateUser({
      where: { email: user.email },
      userInput: { access_token: accessToken },
    });

    return {
      accessToken,
    };
  }
}

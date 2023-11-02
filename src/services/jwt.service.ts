import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey: string = 'yourSecretKey';

  generateToken(payload: any): string {
    return sign(payload, this.secretKey, { expiresIn: '1d' });
  }

  verifyToken(token: string): any {
    try {
      return verify(token, this.secretKey);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

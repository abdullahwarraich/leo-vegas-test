import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { user_role } from '@prisma/client';
import { UpdateUserDto } from '../modules/users/users.dto';

@Injectable()
export class UpdateUserValidationPipe implements PipeTransform {
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<UpdateUserDto> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const updateUserDto = plainToClass(metatype, value);

    const errors: ValidationError[] = await validate(updateUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const validRoles = Object.values(user_role);
    if (updateUserDto.role && !validRoles.includes(updateUserDto.role)) {
      throw new BadRequestException('Invalid user role');
    }

    const allowedKeys = ['name', 'email', 'password', 'role'];
    const receivedKeys = Object.keys(value);
    receivedKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) {
        throw new BadRequestException(`Unexpected value: ${key}`);
      }
    });

    return updateUserDto;
  }
}

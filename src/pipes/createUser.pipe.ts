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
import { CreateUserDto } from '../modules/users/users.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<CreateUserDto> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const createUserDto = plainToClass(CreateUserDto, value);

    const errors: ValidationError[] = await validate(createUserDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const validRoles = Object.values(user_role);
    if (!validRoles.includes(createUserDto.role)) {
      throw new BadRequestException('Invalid user role');
    }

    const allowedKeys = ['name', 'email', 'password', 'role'];
    const receivedKeys = Object.keys(value);
    receivedKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) {
        throw new BadRequestException(`Unexpected value: ${key}`);
      }
    });

    return createUserDto;
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './users.dto';
import { CreateUserValidationPipe } from '../../pipes/createUser.pipe';
import { UpdateUserValidationPipe } from '../../pipes/updateUser.pipe';

import {
  GetUsersGuard,
  GetUserGuard,
  CreateUserGuard,
  UpdateUserGuard,
  DeleteUserGuard,
} from '../../guards/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GetUsersGuard)
  @Get('/')
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @UseGuards(GetUserGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.getUserById(Number(id));
  }

  @UseGuards(CreateUserGuard)
  @UsePipes(new CreateUserValidationPipe())
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(UpdateUserGuard)
  @UsePipes(new UpdateUserValidationPipe())
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.updateUser({
      where: { id: Number(id) },
      userInput: updateUserDto,
    });
  }

  @UseGuards(DeleteUserGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.deleteUser({
      where: { id: Number(id) },
    });
  }
}

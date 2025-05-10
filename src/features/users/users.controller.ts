import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: UserDto })
  @ApiOkResponse({ description: 'Usuário criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Erro ao criar usuário' })
  async createUser(
    @Body() user: UserDto
  ) {
    const userCreated = await this.usersService.create(
      user,
    );

    const { senha, ...resultUser } = userCreated;
    return resultUser;
  }

  @Get('all-users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { AuthService } from '../auth/auth.service';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ChangeRoleDTO } from './dto/change.role.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UsersService } from './users.service';
import { BanUser } from './dto/ban.user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'Users list',
    status: 200,
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async index() {
    const users = await this.usersService.getAllUsers();
    return { users };
  }

  @ApiCreatedResponse({
    description: 'User created',
    status: 201,
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    await this.authService.register(body);
    return { status: HttpStatus.CREATED, message: 'User was created' };
  }

  @ApiCreatedResponse({
    description: 'User is updated',
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async update(@Body() body: UpdateUserDTO) {
    return this.usersService.updateUser(body.id, body);
  }

  @ApiCreatedResponse({
    description: 'User updated',
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async delete(@Body('email') email: string) {
    return this.usersService.removeUser(email);
  }

  @ApiCreatedResponse({
    description: 'Users roles is changed',
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/change-role')
  async changeUserRole(@Body() body: ChangeRoleDTO) {
    return this.usersService.updateUser(body.user_id, { role: body.role });
  }

  @ApiCreatedResponse({
    description: 'User is banned',
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/ban')
  async banUser(@Body() body: BanUser) {
    return this.usersService.updateUser(body.user_id, { banned: true });
  }

  @ApiCreatedResponse({
    description: 'User is unbanned',
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/unban')
  async unBanUser(@Body() body: BanUser) {
    return this.usersService.updateUser(body.user_id, { banned: false });
  }
}

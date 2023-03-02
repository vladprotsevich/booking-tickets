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
import { changeRole } from './dto/change.role.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

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
    type: [UserDTO],
  })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async index() {
    const users = await this.usersService.getAllUsers();
    return { users };
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    await this.authService.register(body);
    return { status: HttpStatus.CREATED, message: 'User was created' };
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async update(@Body() body: UpdateUserDTO) {
    return this.usersService.updateUser(body.id, body);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async delete(@Body('email') email: string) {
    return this.usersService.removeUser(email);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/change-role')
  async changeUserRole(@Body() body: changeRole) {
    return this.usersService.updateUser(body.user_id, { role: body.role });
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/ban')
  async banUser(@Body('user_id') userUUID: string) {
    return this.usersService.updateUser(userUUID, { banned: true });
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/unban')
  async unBanUser(@Body('user_id') userUUID: string) {
    return this.usersService.updateUser(userUUID, { banned: false });
  }
}

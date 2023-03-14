import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ChangeRoleDTO } from './dto/change-user-role.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse({ description: 'Users list' })
  @Roles('Admin', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async allUsers() {
    return this.userService.getAllUsers();
  }

  @ApiCreatedResponse({ description: 'User created' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    await this.authService.register(body);
    return true;
  }

  @ApiCreatedResponse({ description: 'User is updated' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id')
  async update(@Param('id') user_id: string, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(user_id, body);
  }

  @ApiCreatedResponse({ description: 'User is removed' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  async delete(@Param('id') user_id: string) {
    return this.userService.removeUser(user_id);
  }

  @ApiCreatedResponse({ description: 'User role is changed' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id/change-role')
  async changeUserRole(
    @Param('/id') user_id: string,
    @Body() body: ChangeRoleDTO,
  ) {
    return this.userService.updateUser(user_id, { role: body.role });
  }

  @ApiCreatedResponse({ description: 'User is banned' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id/ban')
  async banUser(@Param('id') user_id: string) {
    if (!user_id) throw new BadRequestException('Kindly provide user id');
    return this.userService.updateUser(user_id, { banned: true });
  }

  @ApiCreatedResponse({ description: 'User is unbanned' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id/unban')
  async unBanUser(@Param('id') user_id: string) {
    if (!user_id) throw new BadRequestException('Kindly provide user id');
    return this.userService.updateUser(user_id, { banned: false });
  }
}

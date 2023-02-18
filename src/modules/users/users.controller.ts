import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    description: 'Users list',
    type: [UserDTO],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async index() {
    const users = await this.usersService.getAllUsers();
    return { users };
  }
}

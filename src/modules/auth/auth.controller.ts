import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDTO } from './dto/sign-in.dto';
import { TokenService } from './token.service';
import { TokenDTO } from './dto/token.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiCreatedResponse({
    description: 'Registration was success',
  })
  @Post('/register')
  async register(@Body() body: CreateUserDTO) {
    await this.authService.register(body);
    return { status: HttpStatus.CREATED, message: 'Registration was success' };
  }

  @ApiCreatedResponse({
    description: 'Sing in is success',
  })
  @Post('/login')
  async login(@Body() body: SingInDTO) {
    return this.authService.login(body);
  }

  @ApiCreatedResponse({
    description: 'You successfully refreshed the access token',
  })
  @Post('/refresh')
  async refreshJwtToken(@Body() body: TokenDTO) {
    return this.tokenService.refreshUsersToken(body.token);
  }
}

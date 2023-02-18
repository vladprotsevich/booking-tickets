import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SingInDTO } from './dto/sign-in.dto';
import { TokenService } from './token.service';
import { TokenDTO } from './dto/token.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiCreatedResponse({
    description: 'Registration was success',
    type: SignUpDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/register')
  async register(@Body() body: SignUpDTO) {
    await this.authService.register(body);
    return { status: HttpStatus.CREATED, message: 'Registration was success' };
  }

  @ApiCreatedResponse({
    description: 'Sing in is success',
  })
  @ApiNotFoundResponse({
    description: 'Not Found.',
    type: SingInDTO,
  })
  @Post('/login')
  async login(@Body() body: SingInDTO) {
    return await this.authService.login(body);
  }

  @ApiCreatedResponse({
    description: 'You successfully refreshed the access token',
    type: TokenDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/refresh')
  async refreshJwtToken(@Body() body: TokenDTO) {
    return await this.tokenService.refreshUsersToken(body.token);
  }
}

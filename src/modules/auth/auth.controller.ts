import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SingInDTO } from './dto/sign-in.dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { TokenService } from './token.service';
import { TokenDTO } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/register')
  async register(@Body() body: SignUpDTO) {
    return await this.AuthService.register(body);
  }

  @Post('/login')
  async login(@Body() body: SingInDTO) {
    return await this.AuthService.login(body);
  }

  @Post('/refresh')
  async refreshJwtToken(@Body() body: TokenDTO) {
    return await this.tokenService.refreshUsersToken(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/test')
  async test() {
    return true;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { TokenDTO } from './dto/token.dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post('/refresh')
  async refreshJwtToken(@Body() body: TokenDTO) {
    return await this.tokenService.refreshUsersToken(body.token);
  }
}

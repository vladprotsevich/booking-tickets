import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async generateJwtToken(user: UserDTO, tokenType: string, expHours: string) {
    const payload = { user_email: user.email };
    if (tokenType === 'access_token') {
      payload['user_id'] = user.id;
    }
    const jwt_secret_key = this.configService.get<string>(tokenType + '_key');
    return this.jwtService.sign(payload, {
      secret: jwt_secret_key,
      expiresIn: expHours,
    });
  }

  async refreshUsersToken(refresh_token: string) {
    const user_info = await this.parseJWTToken(refresh_token);
    const user = await this.usersService.findOneByEmail(user_info.user_email);
    if (user && user.token === refresh_token) {
      const access_token = await this.generateJwtToken(
        user,
        'access_token',
        '1h',
      );
      return { access_token };
    } else {
      throw new BadRequestException();
    }
  }

  async parseJWTToken(token: string) {
    const decoded_token = Buffer.from(token.split('.')[1], 'base64').toString();
    return JSON.parse(decoded_token);
  }
}

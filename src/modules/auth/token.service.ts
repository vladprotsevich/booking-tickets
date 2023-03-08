import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/models/user.model';
import { UserPayload } from '../user/models/user-payload.model';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async generateJwtToken(user: User, tokenType: string, expHours: string) {
    const payload: UserPayload = { user_email: user.email, user_id: undefined };
    if (tokenType === 'access_token') {
      payload.user_id = user.id;
    }
    const jwt_secret_key = this.configService.get<string>(tokenType + '_key');
    return this.jwtService.sign(payload, {
      secret: jwt_secret_key,
      expiresIn: expHours,
    });
  }

  async refreshUsersToken(refresh_token: string) {
    const user_info = await this.parseJWTToken(refresh_token);
    const user = await this.userService.findOneByEmail(user_info.user_email);
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

  async parseJWTToken(token: string): Promise<UserPayload> {
    const decoded_token = Buffer.from(token.split('.')[1], 'base64').toString();
    return JSON.parse(decoded_token);
  }
}

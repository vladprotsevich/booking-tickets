import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/models/user.model';
import { UserPayload } from '../user/models/user-payload.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async generateJwtToken(user: User, tokenType: string, expHours: string) {
    const payload = new UserPayload();
    payload.user_email = user.email;
    if (tokenType === 'access_token') {
      payload.user_id = user.id;
    }
    const jwt_secret_key = this.configService.get<string>(tokenType + '_key');
    return this.jwtService.sign(
      { ...payload },
      {
        secret: jwt_secret_key,
        expiresIn: expHours,
      },
    );
  }

  async refreshUserToken(refresh_token: string) {
    const user_info = await this.parseJWTToken(refresh_token);
    const user = await this.userService.findOneByEmail(user_info.user_email);
    const validRefreshToken = await this.decryptUserToken(refresh_token, user);
    if (user && validRefreshToken) {
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

  async decryptUserToken(token: string, user: User) {
    try {
      return bcrypt.compare(token, user.token);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Incorrect token',
      });
    }
  }

  async parseJWTToken(token: string): Promise<UserPayload> {
    const decoded_token = Buffer.from(token.split('.')[1], 'base64').toString();
    return JSON.parse(decoded_token);
  }
}

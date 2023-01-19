import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDTO } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { SingInDTO } from './dto/sign-in.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async generateJwtToken(
    user: UserDTO | SingInDTO,
    tokenType: string,
    expHours: string,
  ) {
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
    const user: UserDTO = await this.usersService.findUserByEmail(
      user_info.user_email,
    );
    if (!user) throw new BadRequestException();
    if (user.token === refresh_token) {
      const access_token = await this.generateJwtToken(
        user,
        'access_token',
        '1h',
      );
      return { access_token };
    }
  }

  async parseJWTToken(token: string) {
    const decoded_token = Buffer.from(token.split('.')[1], 'base64').toString();
    return await JSON.parse(decoded_token);
  }
}

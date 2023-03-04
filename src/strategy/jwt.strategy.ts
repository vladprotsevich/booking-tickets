import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SanitizedUser } from 'src/modules/users/interfaces/sanitized.user.interface';
import { UserPayload } from 'src/modules/users/interfaces/user.payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('access_token_key'),
    });
  }

  async validate(payload: UserPayload): Promise<SanitizedUser> {
    const user = await this.usersService.findOneByEmail(payload.user_email);
    const sanitizedUser = await this.usersService.sanitizeUser(user);
    return { ...sanitizedUser };
  }
}

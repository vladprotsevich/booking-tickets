import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { TokenService } from './token.service';
import { SingInDTO } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../users/dto/create.user.dto';
import { Users } from '../users/models/users.model';
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async register(body: SignUpDTO | CreateUserDTO): Promise<void> {
    const userObj = await this.usersService.findOneByEmail(body.email);
    if (userObj) throw new BadRequestException();
    body.password = await this.encryptUserPassword(body.password);
    await this.usersService.createUser(body);
  }

  async login(body: SingInDTO) {
    const user: Users = await this.usersService.findOneByEmail(body.email);
    if (user && (await this.decryptUserPassword(body.password, user))) {
      const access_token = await this.generateAuthJwtAccessToken(user);
      const refresh_token = await this.generateAuthJwtRefreshToken(user);
      await this.usersService.updateUser(user.id, { token: refresh_token });
      return {
        message: `Welcome ${user.email}`,
        access_token,
        refresh_token,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async encryptUserPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 5);
  }

  async decryptUserPassword(password: string, user: Users): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async generateAuthJwtAccessToken(user: Users): Promise<string> {
    return this.tokenService.generateJwtToken(user, 'access_token', '1h');
  }

  async generateAuthJwtRefreshToken(user: Users): Promise<string> {
    return this.tokenService.generateJwtToken(user, 'refresh_token', '24h');
  }
}

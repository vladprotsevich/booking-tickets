import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { SingInDTO } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { User } from '../user/models/user.model';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async register(body: CreateUserDTO): Promise<void> {
    const userObj = await this.userService.findOneByEmail(body.email);
    if (userObj) throw new BadRequestException();
    body.password = await this.encryptUserPassword(body.password);
    await this.userService.createUser(body);
  }

  async login(body: SingInDTO) {
    const user = await this.userService.findOneByEmail(body.email);
    if (user && (await this.decryptUserPassword(body.password, user))) {
      const access_token = await this.generateAuthJwtAccessToken(user);
      const refresh_token = await this.generateAuthJwtRefreshToken(user);
      await this.userService.updateUser(user.id, { token: refresh_token });
      return {
        message: `Welcome ${user.email}`,
        access_token,
        refresh_token,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async encryptUserPassword(password: string) {
    return bcrypt.hash(password, 5);
  }

  async decryptUserPassword(password: string, user: User) {
    return bcrypt.compare(password, user.password);
  }

  async generateAuthJwtAccessToken(user: User) {
    return this.tokenService.generateJwtToken(user, 'access_token', '1h');
  }

  async generateAuthJwtRefreshToken(user: User) {
    return this.tokenService.generateJwtToken(user, 'refresh_token', '24h');
  }
}

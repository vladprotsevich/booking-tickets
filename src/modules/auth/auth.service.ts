import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SingInDTO } from './dto/sign-in.dto';
import { UserDTO } from '../users/dto/user.dto';
import { TokenService } from './token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: SignUpDTO): Promise<SignUpDTO> {
    const isUserExist = await this.usersService.isUserExist(body);
    if (isUserExist) throw new BadRequestException();
    body.password = await this.encryptUserPassword(body.password);
    await this.usersService.createUser(body);
    const user = await this.usersService.sanitizeUser(body);
    return { ...user };
  }

  async login(body: SingInDTO) {
    const user: UserDTO = await this.usersService.findUserByEmail(body.email);
    if (user && (await this.decryptUserPassword(body.password, user))) {
      const access_token = await this.generateAuthJwtAccessToken(user);
      const refresh_token = await this.generateAuthJwtRefreshToken(user);

      await this.usersService.updateUserById(user.id, 'token', refresh_token);

      return {
        message: `Welcome ${user.email}`,
        access_token,
        refresh_token,
      };
    } else {
      return {
        message: `${body.email} is not registered yet`,
      };
    }
  }

  async encryptUserPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 5);
  }

  async decryptUserPassword(
    password: string,
    body: SignUpDTO | SingInDTO | any,
  ): Promise<boolean> {
    return await bcrypt.compare(password, body.password);
  }

  async parseJwtToken(token: string) {
    const decoded_token = Buffer.from(token.split('.')[1], 'base64').toString();
    return await JSON.parse(decoded_token);
  }

  async generateAuthJwtAccessToken(user: UserDTO) {
    return await this.tokenService.generateJwtToken(user, 'access_token', '1h');
  }

  async generateAuthJwtRefreshToken(user: UserDTO) {
    return await this.tokenService.generateJwtToken(
      user,
      'refresh_token',
      '24h',
    );
  }
}

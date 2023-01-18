import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SingInDTO } from './dto/sign-in.dto';
import { UserDTO } from '../users/dto/user.dto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly TokenService: TokenService,
  ) {}

  async register(body: SignUpDTO): Promise<SignUpDTO> {
    const isUserExist = await this.UsersService.isUserExist(body);
    if (isUserExist) throw new BadRequestException();
    body.password = await this.encryptUserPassword(body.password);
    await this.UsersService.createUser(body);
    return body;
  }

  async login(body: SingInDTO) {
    const user: UserDTO = await this.UsersService.findUserByEmail(body.email);
    if (user && (await this.decryptUserPassword(body.password, user))) {
      const access_token = await this.generateAuthJwtAccessToken(user);
      const refresh_token = await this.generateAuthJwtRefreshToken(user);

      await this.UsersService.updateUserById(user.id, 'token', refresh_token);

      return {
        message: `Welcome ${user.email}`,
        access_token: access_token,
        refresh_token: refresh_token,
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
    return await this.TokenService.generateJwtToken(user, 'access_token', '1h');
  }

  async generateAuthJwtRefreshToken(user: UserDTO) {
    return await this.TokenService.generateJwtToken(
      user,
      'refresh_token',
      '24h',
    );
  }
}

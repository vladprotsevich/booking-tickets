import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { dbConf } from 'src/db/knexfile';
import { SignUpDTO } from '../auth/dto/sign-up.dto';
import { SingInDTO } from '../auth/dto/sign-in.dto';

@Injectable()
export class UsersService {
  async createUser(body: SignUpDTO): Promise<UserDTO> {
    return await dbConf('users').insert(body);
  }

  async findUserById(id: string | number): Promise<UserDTO> {
    return await dbConf('users').where('id', id)?.first();
  }

  async findUserByEmail(email: string): Promise<UserDTO> {
    return await dbConf('users').where('email', email).first();
  }

  async updateUserById(
    userId: string | number,
    attrName: string,
    attrValue: string,
  ) {
    return await dbConf('users')
      .where('id', userId)
      .update(attrName, attrValue);
  }

  async isUserExist(info: SignUpDTO | SingInDTO | UserDTO): Promise<boolean> {
    let userById = null;
    let userByEmail = null;
    info.id && (userById = await this.findUserById(info.id));
    info.email && (userByEmail = await this.findUserByEmail(info.email));

    return userById || userByEmail;
  }

  async sanitizeUser(body: any) {
    body.password = null;
    body.token = null;
    body = Object.entries(body).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {},
    );
    return body;
  }
}

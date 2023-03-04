import { Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update.user.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { dbConf } from 'src/db/knexfile';
import { User } from './models/users.model';
import { Knex } from 'knex';
import { SanitizedUser } from './interfaces/sanitized.user.interface';

@Injectable()
export class UsersService {
  qb(table?: string): Knex.QueryBuilder<User> {
    table ||= 'users';
    return dbConf(table);
  }

  async getAllUsers(): Promise<User[]> {
    return this.qb();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.qb().where({ email }).first();
  }

  async createUser(body: CreateUserDTO): Promise<User> {
    return this.qb().insert(body);
  }

  async updateUser(id: string, body: UpdateUserDTO): Promise<boolean> {
    try {
      const result = await this.qb().where({ id }).update(body);
      return Boolean(result);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async removeUser(email: string): Promise<User> {
    return this.qb().where({ email }).del();
  }

  async sanitizeUser(user: User): Promise<SanitizedUser> {
    const sanitizedUser = new SanitizedUser();
    sanitizedUser.id = user.id;
    sanitizedUser.name = user.name;
    sanitizedUser.surname = user.surname;
    sanitizedUser.email = user.email;
    sanitizedUser.role = user.role;

    return sanitizedUser;
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update.user.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { dbConf } from 'src/db/knexfile';
import { Users } from './models/users.model';
import { Knex } from 'knex';
import { SanitizedUser } from './interfaces/sanitized.user.interface';

@Injectable()
export class UsersService {
  qb(table?: string): Knex.QueryBuilder<Users> {
    table ||= 'users';
    return dbConf(table);
  }

  async getAllUsers(): Promise<Users[]> {
    return this.qb();
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.qb().where({ email }).first();
  }

  async createUser(body: CreateUserDTO): Promise<Users> {
    return this.qb().insert(body);
  }

  async updateUser(id: string, body: UpdateUserDTO): Promise<Users> {
    return this.qb().where({ id }).update(body);
  }

  async removeUser(email: string): Promise<Users> {
    return this.qb().where({ email }).del();
  }

  async sanitizeUser(body: Users): Promise<SanitizedUser> {
    body.password = undefined;
    body.token = undefined;

    return JSON.parse(JSON.stringify(body));
  }
}

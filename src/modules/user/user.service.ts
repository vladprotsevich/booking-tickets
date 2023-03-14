import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { dbConf } from 'src/db/knexfile';
import { User } from './models/user.model';
import { SanitizedUser } from './models/sanitized-user.';

@Injectable()
export class UserService {
  private qb() {
    return dbConf<User>('users');
  }

  async getAllUsers() {
    return this.qb();
  }

  async findOneByEmail(email: string) {
    return this.qb().where({ email }).first();
  }

  async createUser(body: CreateUserDTO) {
    try {
      const [user] = await this.qb().insert(body).returning('*');
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a user with invalid data',
      });
    }
  }

  async updateUser(id: string, body: UpdateUserDTO) {
    try {
      const affected = await this.qb().where({ id }).update(body);
      return Boolean(affected);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot update the user with invalid data',
      });
    }
  }

  async removeUser(id: string) {
    try {
      const deletedUser = await this.qb().where({ id }).del();
      return Boolean(deletedUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot delete user',
      });
    }
  }

  async sanitizeUser(body: User) {
    const sanitizedUser = new SanitizedUser();

    sanitizedUser.id = body.id;
    sanitizedUser.name = body.name;
    sanitizedUser.surname = body.surname;
    sanitizedUser.email = body.email;
    sanitizedUser.role = body.role;

    return sanitizedUser;
  }
}

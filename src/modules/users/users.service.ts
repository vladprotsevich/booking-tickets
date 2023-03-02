import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update.user.dto';
import { SignUpDTO } from '../auth/dto/sign-up.dto';
import { DatabaseService } from '../database/database.service';
import { sanitizeBody } from '../../common/sanitize';
import { UserDTO } from './dto/user.dto';
import { CreateUserDTO } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers() {
    return this.databaseService.findAll('users', ['*'], {});
  }

  async createUser(body: SignUpDTO | CreateUserDTO) {
    return this.databaseService.createObj('users', body);
  }

  async updateUser(userUUID: string, body: UpdateUserDTO) {
    return this.databaseService.updateObj('users', body, { id: userUUID });
  }

  async removeUser(email: string) {
    return this.databaseService.removeObj('users', { email });
  }

  async findOneByEmail(email: string) {
    return this.databaseService.findOne('users', ['*'], { email });
  }

  async sanitizeUser(body: UserDTO) {
    body.password = null;
    body.token = null;

    return sanitizeBody(body);
  }
}

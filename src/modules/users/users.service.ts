import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update.user.dto';
import { SignUpDTO } from '../auth/dto/sign-up.dto';
import { DatabaseService } from '../database/database.service';
import { sanitizeBody } from '../../common/sanitize';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers() {
    return this.databaseService.findAll('users', ['*'], {});
  }

  async createUser(body: SignUpDTO) {
    return this.databaseService.createObj('users', body);
  }

  async updateUser(id: string | number, body: UpdateUserDTO) {
    return this.databaseService.updateObj('users', body, { id: id });
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

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FrequenciesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(statements: object) {
    return await this.databaseService.findOne('frequencies', ['*'], statements);
  }
}

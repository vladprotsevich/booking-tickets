import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FrequenciesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(statements: object) {
    return this.databaseService.findOne('frequencies', ['*'], statements);
  }
}

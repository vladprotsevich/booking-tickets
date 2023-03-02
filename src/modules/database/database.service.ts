import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';

@Injectable()
export class DatabaseService {
  async findAll(table: string, columns: string[], filters?: object) {
    let dbQuery = dbConf(table).select(columns).returning('*');

    return Object.keys(filters).length ? dbQuery.where(filters) : dbQuery;
  }

  async findOne(table: string, columns: string[], filters?: object) {
    try {
      const firstObj = await this.findAll(table, columns, filters);
      return firstObj[0];
    } catch {
      throw new NotFoundException();
    }
  }

  async createObj(
    table: string,
    columns: object,
    transaction?: Knex.Transaction,
  ) {
    try {
      const dbQuery = dbConf(table).insert(columns).returning('*');

      return transaction ? dbQuery.transacting(transaction) : dbQuery;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateObj(
    table: string,
    columns: object,
    filters: object,
    transaction?: Knex.Transaction,
  ) {
    try {
      const dbQuery = dbConf(table)
        .where(filters)
        .update(columns)
        .returning('*');
      return transaction ? dbQuery.transacting(transaction) : dbQuery;
    } catch {
      throw new BadRequestException();
    }
  }

  async removeObj(
    table: string,
    filters: object,
    transaction?: Knex.Transaction,
  ) {
    try {
      const dbQuery = dbConf(table).where(filters).del();
      return transaction ? dbQuery.transacting(transaction) : dbQuery;
    } catch {
      throw new BadRequestException();
    }
  }
}

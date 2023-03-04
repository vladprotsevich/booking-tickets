import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { DaysOfWeek } from 'src/common/enums/days.enum';
import { FrequencyType } from 'src/common/enums/frequency.enum';
import { dbConf } from 'src/db/knexfile';
import { Frequencies } from './models/frequency.model';

@Injectable()
export class FrequenciesService {
  qb(table?: string) {
    table ||= 'frequencies';
    return dbConf(table);
  }

  async findOne(frequency: string): Promise<Frequencies> {
    return this.qb().where({ frequency }).first();
  }

  async getDayOfWeek(inputDate: string) {
    // tuples
    const date = new Date(inputDate);

    if (date.toString() === 'Invalid Date') throw new BadRequestException();

    const dayType = date.getDate() % 2 ? 'odd' : 'even';
    const dayOfWeek = DaysOfWeek[date.getDay()];
    return { dayType, dayOfWeek };
  }

  async createTrainsFrequency(
    train_id: string,
    frequencies: FrequencyType[],
    trx: Knex.Transaction,
  ): Promise<Frequencies[]> {
    const frequenciesArray = frequencies.map(frequency => ({ train_id, frequency }));
    return this.qb().transacting(trx).insert(frequenciesArray).returning('*');
  }
}

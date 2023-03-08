import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { DaysOfWeek } from 'src/common/enums/days.enum';
import { FrequencyEnum } from 'src/common/enums/frequency.enum';
import { dbConf } from 'src/db/knexfile';
import { Frequency } from './models/frequency.model';

@Injectable()
export class FrequencyService {
  private qb() {
    return dbConf<Frequency>('frequencies');
  }

  async findOne(frequency: FrequencyEnum) {
    return this.qb().where({ frequency }).first();
  }

  async getDayOfWeek(inputDate: string) {
    const date = new Date(inputDate);
    if (date.toString() === 'Invalid Date') throw new BadRequestException();
    const dayType = date.getDate() % 2 ? 'odd' : 'even';
    const dayOfWeek = DaysOfWeek[date.getDay()];
    return { dayType, dayOfWeek };
  }

  async createTrainsFrequency(
    train_id: string,
    frequencies: FrequencyEnum[],
    trx: Knex.Transaction,
  ) {
    const frequencyCollection = frequencies.map((frequency) => ({
      train_id,
      frequency,
    }));
    const freqObjects = await this.qb()
      .transacting(trx)
      .insert(frequencyCollection)
      .returning('frequency');
    return freqObjects.map((freq) => freq.frequency);
  }
}

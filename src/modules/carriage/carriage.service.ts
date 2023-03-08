import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { CreateCarriageDTO } from './dto/create-carriage.dto';
import { TypeToAmount } from '../../common/type-to-amount.map';
import { Carriage } from './models/carriage.model';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class CarriageService {
  constructor(private readonly seatService: SeatService) {}

  private qb() {
    return dbConf<Carriage>('carriages');
  }

  async findAll() {
    return this.qb();
  }

  async findOne(id: string) {
    return this.qb().where({ id }).first();
  }

  async create(body: CreateCarriageDTO, trx: Knex.Transaction) {
    try {
      const [carriage] = await this.qb()
        .transacting(trx)
        .insert(body)
        .returning('*');
      return carriage;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create the carriage with invalid data',
      });
    }
  }

  async createCarriage(body: CreateCarriageDTO) {
    const trx = await dbConf.transaction();
    try {
      const carriage = await this.create(body, trx);
      await this.createCarriageSeats(carriage, trx);
      await trx.commit();
      return carriage;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description:
          'Cannot create the carriage and the seats with invalid data',
      });
    }
  }

  async createCarriageSeats(carriage: Carriage, trx: Knex.Transaction) {
    let amount = TypeToAmount[carriage.carriage_type];
    return this.seatService.createSeatsCollection(amount, carriage.id, trx);
  }

  async findCarriageByTrain(id: string, train_id: string) {
    return this.qb().where({ id, train_id });
  }
}

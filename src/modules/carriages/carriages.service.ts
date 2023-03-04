import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { CreateCarriageDTO } from './dto/create.carriage.dto';
import { TypeToAmount } from '../../common/type.to.amount.map';
import { Carriages } from './models/carriges.model';
import { Seats } from './models/seats.model';
import { SeatsService } from './seats.service';

@Injectable()
export class CarriagesService {
  constructor(
    @Inject(forwardRef(() => SeatsService))
    private readonly seatsService: SeatsService,
  ) {}

  qb(table?: string) {
    table ||= 'carriages';
    return dbConf<Carriages>(table);
  }

  async findAll() {
    return this.qb();
  }

  async findOne(id: string) {
    return this.qb().where({ id }).first();
  }

  async create(
    body: CreateCarriageDTO,
    trx: Knex.Transaction,
  ): Promise<Carriages> {
    const [carriage] = await this.qb().transacting(trx).insert(body).returning('*');
    return carriage;
  }

  async createCarriage(body: CreateCarriageDTO): Promise<Carriages> {
    let trx: Knex.Transaction;

    try {
      trx = await dbConf.transaction();
      const carriage = await this.create(body, trx);
      await this.createCarriageSeats(carriage, trx);
      await trx.commit();
      return carriage;
    } catch (e) {
      await trx.rollback();
      console.error(e);
    }
  }

  async createCarriageSeats(
    carriage: Carriages,
    trx: Knex.Transaction,
  ): Promise<Seats[]> {
    let amount = TypeToAmount[carriage.carriage_type];

    return this.seatsService.createSeatsCollection(amount, carriage.id, trx);
  }
}

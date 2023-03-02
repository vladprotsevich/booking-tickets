import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Carriages } from 'src/common/enums/carriages.enum';
import { dbConf } from 'src/db/knexfile';
import { DatabaseService } from '../database/database.service';
import { CarriageDTO } from './dto/carriage.dto';
import { CreateCarriageDTO } from './dto/create.carriage.dto';
import { SeatsService } from './seats.service';

@Injectable()
export class CarriagesService {
  constructor(
    private readonly databaseServices: DatabaseService,
    @Inject(forwardRef(() => SeatsService))
    private readonly seatsService: SeatsService,
  ) {}

  async findAll(statements: object) {
    return this.databaseServices.findAll('carriages', ['*'], statements);
  }

  async findOne(statements: object) {
    return this.databaseServices.findOne('carriages', ['*'], statements);
  }

  async create(carriageInfo: CreateCarriageDTO, trx: Knex.Transaction) {
    return this.databaseServices.createObj('carriages', carriageInfo, trx);
  }

  async createCarriage(carriageInfo: CreateCarriageDTO) {
    const trx = await dbConf.transaction();
    const carriage = await this.create(carriageInfo, trx);
    await this.createCarriageSeats(carriage[0], trx);
    trx.commit();
    return carriage;
  }

  async createCarriageSeats(carriage: CarriageDTO, trx: Knex.Transaction) {
    let amount = 0;
    if (Carriages.reserved == carriage.carriage_type) amount = 30;
    if (Carriages.couple == carriage.carriage_type) amount = 20;
    if (Carriages.luxury == carriage.carriage_type) amount = 10;

    return this.seatsService.createSeatsCollection(amount, carriage.id, trx);
  }
}

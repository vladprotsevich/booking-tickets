import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Carriages } from 'src/common/enums/carriages.enum';
import { Prices } from 'src/common/enums/prices.enum';
import { dbConf } from 'src/db/knexfile';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { CarriagesService } from '../carriages/carriages.service';
import { DatabaseService } from '../database/database.service';
import { TrainDTO } from '../trains/dto/train.dto';
import { CreatePriceDTO } from './dto/create.price.dto';
import { UpdatePricesDTO } from './dto/update.prices.dto';

@Injectable()
export class PricesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly arrivalsService: ArrivalsService,
    private readonly carriagesService: CarriagesService,
  ) {}

  async createPrice(body: CreatePriceDTO, trx: Knex.Transaction) {
    return dbConf('prices').insert(body).returning('*').transacting(trx);
  }

  async createTicketsPrice(
    departureStation: string,
    arrivalStation: string,
    carriageUUID: string,
    ticketUUID: string,
    train: TrainDTO,
    trx: Knex.Transaction,
  ) {
    const departureOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      departureStation,
    );

    const arrivalOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      arrivalStation,
    );
    const carriage = await this.carriagesService.findOne({ id: carriageUUID });
    const stationsInterval = arrivalOrder - departureOrder;
    const price = await this.calculatePrice(
      carriage.carriage_type,
      stationsInterval,
    );

    const priceObject = {
      ticket_id: ticketUUID,
      departure_station: departureStation,
      arrival_station: arrivalStation,
      train_type: train.train_type,
      carriage_type: carriage.carriage_type,
      price,
    };
    return this.createPrice(priceObject, trx);
  }

  async update(
    ticketUUID: UpdatePricesDTO,
    priceUUID: string,
    trx: Knex.Transaction,
  ) {
    return dbConf('prices')
      .update('ticket_id', ticketUUID)
      .where('id', priceUUID)
      .returning('*')
      .transacting(trx);
  }

  async calculatePrice(carriageType: Carriages, stationsInterval: number) {
    return Prices[carriageType] * stationsInterval;
  }
}

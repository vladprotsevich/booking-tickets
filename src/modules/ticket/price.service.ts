import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PriceEnum } from 'src/common/carriage-type-price.map';
import { CarriageEnum } from 'src/common/enums/carriage.enum';
import { dbConf } from 'src/db/knexfile';
import { ArrivalService } from '../arrival/arrival.service';
import { CarriageService } from '../carriage/carriage.service';
import { TrainService } from '../train/train.service';
import { CreatePriceData } from './models/price-data.model';
import { Price } from './models/price.model';
import { Ticket } from './models/ticket.model';

@Injectable()
export class PriceService {
  constructor(
    private readonly trainService: TrainService,
    private readonly arrivalService: ArrivalService,
    private readonly carriageService: CarriageService,
  ) {}

  private qb() {
    return dbConf<Price>('prices');
  }

  async create(body: CreatePriceData, trx: Knex.Transaction) {
    try {
      const [price] = await this.qb()
        .transacting(trx)
        .insert(body)
        .returning('*');
      return price;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a price with invalida data',
      });
    }
  }

  async createTicketPrice(ticket: Ticket, trx: Knex.Transaction) {
    const train = await this.trainService.findOne(ticket.train_id);
    const carriage = await this.carriageService.findOne(ticket.carriage_id);

    const distance = await this.calculateDistance(
      ticket.departure_station,
      ticket.arrival_station,
      train.route_id,
    );
    const ticketPrice = await this.calculatePrice(
      carriage.carriage_type,
      distance,
    );

    const priceObject = new CreatePriceData();

    priceObject.ticket_id = ticket.id;
    priceObject.departure_station = ticket.departure_station;
    priceObject.arrival_station = ticket.arrival_station;
    priceObject.train_type = train.train_type;
    priceObject.carriage_type = carriage.carriage_type;
    priceObject.price = ticketPrice;

    return this.create(priceObject, trx);
  }

  async removePriceByTicket(ticket_id: string, trx: Knex.Transaction) {
    return this.qb().transacting(trx).where({ ticket_id }).del();
  }

  async calculateDistance(
    departureStation: string,
    arrivalStation: string,
    route_id: string,
  ) {
    const departureOrder = await this.arrivalService.getCurrentStationOrder(
      route_id,
      departureStation,
    );
    const arrivalOrder = await this.arrivalService.getCurrentStationOrder(
      route_id,
      arrivalStation,
    );
    return arrivalOrder - departureOrder;
  }

  async calculatePrice(carriageType: CarriageEnum, stationsInterval: number) {
    return PriceEnum[carriageType] * stationsInterval;
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { SearchTrainQueryDTO } from '../trains/dto/search.train.query.dto';
import { TrainsService } from '../trains/trains.service';
import { CreateSeatDTO } from './dto/create.seat.dto';
import { Trains } from '../trains/models/trains.model';
import { Seats } from './models/seats.model';
import { UnAvailableSeat } from './interfaces/unavailable.seats.interface';

@Injectable()
export class SeatsService {
  constructor(
    @Inject(forwardRef(() => TrainsService))
    private readonly trainsService: TrainsService,
    private readonly arrivalsService: ArrivalsService,
  ) {}

  qb(table?: string) {
    table ||= 'seats';
    return dbConf<Seats>(table);
  }

  async findOne(id: string) {
    return this.qb().where({ id }).first();
  }

  async create(body: CreateSeatDTO, trx: Knex.Transaction): Promise<Seats> {
    const [seat] = await this.qb().transacting(trx).insert(body).returning('*');
    return seat;
  }

  async createSeatsCollection(
    amount: number,
    carriage_id: string,
    trx: Knex.Transaction,
  ): Promise<Seats[]> {
    const promises = [];
    for (let i = 1; i < amount + 1; i++) {
      promises.push(this.create({ number: i, carriage_id }, trx));
    }
    return Promise.all(promises);
  }

  async getTrainAvailableSeats(
    trains: Trains[],
    query: SearchTrainQueryDTO,
  ): Promise<Seats[]> {
    const { train_id } = query;
    const train = trains
      .map((train) => train.id)
      .filter((id) => id === train_id);
    if (train.length < 1) throw new BadRequestException();

    return this.findAvailableSeats(query);
  }

  async filterTrainsBySeatsAvailability(
    query: SearchTrainQueryDTO,
    trains: Trains[],
  ) {
    const suitableTrains: string[] = [];
    for (let i = 0; i < trains.length; i++) {
      const availableSeats = await this.findAvailableSeats(query, trains[i].id);

      availableSeats.length > 1 && suitableTrains.push(trains[i].id);
    }
    return suitableTrains;
  }

  async findAvailableSeats(
    query: SearchTrainQueryDTO,
    train_id?: string,
  ): Promise<Seats[]> {
    train_id ||= query.train_id;
    const { departureStation, arrivalStation, departureDate } = query;
    const train = await this.trainsService.findOne(train_id);
    const departureOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      departureStation,
    );
    const arrivalOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      arrivalStation,
    );
    const args: UnAvailableSeat = {
      departureOrder,
      arrivalOrder,
      departure_date: departureDate,
      train_id: train.id,
      route_id: train.route_id,
    };
    const unAvailableSeats = await this.getUnAvailableSeats(args);
    return this.getAvailableSeats(train.id, unAvailableSeats);
  }

  async getUnAvailableSeats(
    args: UnAvailableSeat,
  ): Promise<Seats[]> {
    const [departureStations, arrivalStations] = await Promise.all([
      this.arrivalsService
        .qb()
        .select('station_id')
        .where({ route_id: args.route_id })
        .where('order', '<', args.arrivalOrder),
      this.arrivalsService
        .qb()
        .select('station_id')
        .where({ route_id: args.route_id })
        .andWhere('order', '>', args.departureOrder),
    ]);

    return this.qb()
      .distinct('id')
      .innerJoin('tickets', 'tickets.seat_id', '=', 'seats.id')
      .where({ departure_date: args.departure_date })
      .andWhere({ train_id: args.train_id })
      .whereIn('departure_station', departureStations)
      .whereIn('arrival_station', arrivalStations);
  }

  async getAvailableSeats(
    train_id: string,
    unAvailableSeats: Seats[],
  ): Promise<Seats[]> {
    const unvalidSeats = unAvailableSeats.map((seat) => seat.id);
    return this.qb()
      .select('seats.*')
      .innerJoin('carriages', 'carriages.id', '=', 'seats.carriage_id')
      .where({ train_id })
      .whereNotIn('seats.id', unvalidSeats)
      // .first();
  }
}

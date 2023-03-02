import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { DatabaseService } from '../database/database.service';
import { TrainDTO } from '../trains/dto/train.dto';
import { SearchTrainsByParamsDTO } from '../trains/dto/search.trains.by.params.dto';
import { TrainsService } from '../trains/trains.service';
import { CarriagesService } from './carriages.service';
import { CreateSeatDTO } from './dto/create.seat.dto';
import { SeatDTO } from './dto/seat.dto';

@Injectable()
export class SeatsService {
  constructor(
    @Inject(forwardRef(() => TrainsService))
    private readonly trainsService: TrainsService,
    @Inject(forwardRef(() => CarriagesService))
    private readonly carriagesService: CarriagesService,
    private readonly arrivalsService: ArrivalsService,
    private readonly databaseService: DatabaseService,
  ) {}

  async findOne(statements: object) {
    return this.databaseService.findOne('seats', ['*'], statements);
  }

  async create(body: CreateSeatDTO, trx: Knex.Transaction) {
    return this.databaseService.createObj('seats', body, trx);
  }

  async createSeatsCollection(
    amount: number,
    carriageUUID: string,
    trx: Knex.Transaction,
  ) {
    const seats = [];
    for (let i = 1; i < amount + 1; i++) {
      seats.push(this.create({ number: i, carriage_id: carriageUUID }, trx));
    }
    return Promise.all(seats);
  }

  async getTrainAvailableSeats(
    trains: TrainDTO[],
    query: SearchTrainsByParamsDTO,
  ) {
    const { departureStation, arrivalStation, departureDate, trainUUID } =
      query;
    const train = trains
      .map((train) => train.id)
      .filter((id) => id === trainUUID);
    if (train.length < 1) throw new BadRequestException();
    return this.findAvailableSeats(
      departureStation,
      arrivalStation,
      departureDate,
      trainUUID,
    );
  }

  async filterTrainsBySeatsAvailability(
    query: SearchTrainsByParamsDTO,
    trains: TrainDTO[],
  ) {
    const { departureStation, arrivalStation, departureDate } = query;
    const suitableTrains = [];
    for (let i = 0; i < trains.length; i++) {
      const availableSeats = await this.findAvailableSeats(
        departureStation,
        arrivalStation,
        departureDate,
        trains[i].id,
      );

      availableSeats.length > 1 && suitableTrains.push(trains[i].id);
    }

    return this.trainsService.getTrainsByRange(suitableTrains);
  }

  async findAvailableSeats(
    departureStation: string,
    arrivalStation: string,
    departureDate: string,
    trainUUID: string,
  ) {
    const train = await this.trainsService.findOne({ id: trainUUID });

    const departureOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      departureStation,
    );

    const arrivalOrder = await this.arrivalsService.getCurrentStationOrder(
      train.route_id,
      arrivalStation,
    );

    const unAvailableSeats = await this.getUnAvailableSeats(
      departureOrder,
      arrivalOrder,
      departureDate,
      train.route_id,
      train.id,
    );

    return this.getAvailableSeats(train.id, unAvailableSeats);
  }

  async getUnAvailableSeats(
    departureOrder: string,
    arrivalOrder: string,
    departureDate: string,
    routeUUID: string,
    trainUUID: string,
  ) {
    return dbConf('seats')
      .distinct('seats.id')
      .innerJoin('tickets', function () {
        this.on('tickets.seat_id', '=', 'seats.id');
      })
      .where('departure_date', departureDate)
      .andWhere('tickets.train_id', trainUUID)
      .whereIn(
        'departure_station',
        dbConf('arrivals')
          .select('station_id')
          .where('route_id', '=', routeUUID)
          .andWhere('order', '<', arrivalOrder),
      )
      .whereIn(
        'arrival_station',
        dbConf('arrivals')
          .select('station_id')
          .where('route_id', '=', routeUUID)
          .andWhere('order', '>', departureOrder),
      );
  }

  async getAvailableSeats(trainUUID: string, unAvailableSeats: SeatDTO[]) {
    const unvalidSeats = unAvailableSeats.map((seat) => seat.id);
    return dbConf('seats')
      .select('seats.*')
      .innerJoin('carriages', function () {
        this.on('seats.carriage_id', 'carriages.id');
      })
      .where('carriages.train_id', trainUUID)
      .whereNotIn('seats.id', unvalidSeats);
  }
}

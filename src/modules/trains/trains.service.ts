import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { SeatsService } from '../carriages/seats.service';
import { CreateTrainDTO } from './dto/create.train.dto';
import { SearchTrainQueryDTO } from './dto/search.train.query.dto';
import { FrequenciesService } from './frequencies.service';
import { SchedulesService } from './schedule.service';
import { Trains } from './models/trains.model';
import { Schedule } from './interfaces/schedule.interface';
import { Seats } from '../carriages/models/seats.model';

@Injectable()
export class TrainsService {
  constructor(
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
    @Inject(forwardRef(() => SeatsService))
    private readonly seatsService: SeatsService,
    private readonly frequenciesService: FrequenciesService,
  ) {}

  qb(table?: string) {
    table ||= 'trains';
    return dbConf(table);
  }

  async getAvailableTrains(
    query: SearchTrainQueryDTO,
  ): Promise<Trains[] | Seats[]> {
    const { departureDate, train_id } = query;
    const suitableTrains = await this.filterTrainsByFrequencies(departureDate); // Looking for trains suitable for the params
    const availableTrains =
      await this.seatsService.filterTrainsBySeatsAvailability(
        query,
        suitableTrains,
      ); // Looking for trains with one or more available seats
    return train_id
      ? this.seatsService.getTrainAvailableSeats(availableTrains, query)
      : availableTrains;
  }

  async findOne(id: string): Promise<Trains> {
    return this.qb().where({ id }).first();
  }

  async getSchedule(train_id: string): Promise<Schedule[]> {
    return this.scheduleService.getSchedule(train_id);
  }

  async getTrainsByRange(trains_id: string[]): Promise<Trains[]> {
    return this.qb().whereIn('id', trains_id);
  }

  async create(body: CreateTrainDTO, trx: Knex.Transaction): Promise<Trains> {
    const { frequencies, ...rest } = body;
    const train: Trains[] = await this.qb()
      .transacting(trx)
      .insert(rest)
      .returning('*');
    return train[0];
  }

  async getPassingTrains(station_id: string): Promise<Trains[]> {
    // returns the list of trains which pass via the received station
    return this.qb()
      .innerJoin('routes', 'routes.id', '=', 'trains.route_id')
      .innerJoin('arrivals', 'arrivals.route_id', '=', 'routes.id')
      .where({ station_id });
  }

  async filterTrainsByFrequencies(departureDate: string): Promise<Trains[]> {
    const frequencies = await this.frequenciesService.getDayOfWeek(
      departureDate,
    );
    return this.qb()
      .distinct('number')
      .innerJoin('frequencies', 'frequencies.train_id', '=', 'trains.id')
      .whereIn('frequencies.frequency', [...frequencies, 'daily']);
  }

  async createTrain(trainBody: CreateTrainDTO): Promise<Trains> {
    const trx = await dbConf.transaction();
    const { frequencies, ...rest } = trainBody;
    const train = await this.create(rest, trx);
    const trainFrequencies =
      await this.frequenciesService.createTrainsFrequency(
        train.id,
        frequencies,
        trx,
      );
    trx.commit();
    train.frequencies = trainFrequencies;
    return train;
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Knex } from 'knex';
import { DaysOfWeek } from 'src/common/enums/days.enum';
import { Frequencies } from 'src/common/enums/frequency.enum';
import { dbConf } from 'src/db/knexfile';
import { DatabaseService } from '../database/database.service';
import { SeatsService } from '../carriages/seats.service';
import { CreateTrainDTO } from './dto/create.train.dto';
import { SearchTrainsByParamsDTO } from './dto/search.trains.by.params.dto';
import { FrequenciesService } from './frequencies.service';
import { SchedulesService } from './schedule.service';

@Injectable()
export class TrainsService {
  constructor(
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
    @Inject(forwardRef(() => SeatsService))
    private readonly seatsService: SeatsService,
    private readonly databaseService: DatabaseService,
    private readonly frequenciesService: FrequenciesService,
  ) {}

  async getAvailableTrains(query: SearchTrainsByParamsDTO) {
    const { departureDate, trainUUID } = query;
    const suitableTrains = await this.filterTrainsByFrequencies(departureDate); // First step of validation. Looking for trains suitable for the params
    const availableTrains =
      await this.seatsService.filterTrainsBySeatsAvailability(
        query,
        suitableTrains,
      ); // Second step of validation. It checks trains with one or more available seats

    return trainUUID
      ? this.seatsService.getTrainAvailableSeats(availableTrains, query)
      : availableTrains;
  }

  async findOne(statements: object) {
    return this.databaseService.findOne('trains', ['*'], statements);
  }

  async createTrain(trainBody: CreateTrainDTO) {
    const trx = await dbConf.transaction();
    const frequencies = trainBody.frequency;
    const { frequency, ...rest } = trainBody;
    const train = await this.databaseService.createObj('trains', rest, trx);
    await this.createTrainsFrequency(train[0].id, frequencies, trx);
    trx.commit();
    return train;
  }

  async createTrainsFrequency(
    trainUUID: string,
    frequencies: Frequencies[],
    trx: Knex.Transaction,
  ) {
    const frequenciesArray = [];
    for (let i = 0; i < frequencies.length; i++) {
      const frequencyObj = await this.frequenciesService.findOne({
        frequency: frequencies[i],
      });
      frequenciesArray.push({
        train_id: trainUUID,
        frequency: frequencyObj.frequency,
      });
    }
    await this.databaseService.createObj(
      'trains_frequencies',
      frequenciesArray,
      trx,
    );
  }

  async getSchedule(trainNumber: string) {
    return this.scheduleService.getSchedule(trainNumber);
  }

  async getDayOfWeek(inputDate: string) {
    const date = new Date(inputDate);

    if (date.toString() === 'Invalid Date') {
      throw new BadRequestException();
    } else {
      const dayType = date.getDate() % 2 ? 'odd' : 'even';
      const dayOfWeek = DaysOfWeek[date.getDay()];

      return [dayType, dayOfWeek];
    }
  }

  async getTrainsByRange(trainsUUID: string[]) {
    return dbConf('trains').whereIn('trains.id', trainsUUID);
  }

  async getPassingTrains(stationUUID: string) {
    // returns the list of trains which pass via the received station
    return dbConf
      .select('trains.*')
      .from('trains')
      .innerJoin('routes', function () {
        this.on('routes.id', 'trains.route_id');
      })
      .innerJoin('arrivals', function () {
        this.on('arrivals.route_id', 'routes.id');
      })
      .where('arrivals.station_id', stationUUID);
  }

  async filterTrainsByFrequencies(departureDate: string) {
    const frequencyStatements = await this.getDayOfWeek(departureDate);
    return dbConf
      .select('trains.*')
      .from('trains')
      .distinct('trains.number')
      .innerJoin('trains_frequencies', function () {
        this.on('trains.id', '=', 'trains_frequencies.train_id');
      })
      .whereIn('trains_frequencies.frequency', [
        ...frequencyStatements,
        'daily',
      ]);
  }
}

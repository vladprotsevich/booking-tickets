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
import { CreateTrainDTO } from './dto/create.train.dto';
import { TrainRouteDTO } from './dto/trains.route.dto';
import { FrequenciesService } from './frequencies.service';
import { SchedulesService } from './schedule.service';

@Injectable()
export class TrainsService {
  constructor(
    @Inject(forwardRef(() => SchedulesService))
    private readonly scheduleService: SchedulesService,
    private readonly databaseService: DatabaseService,
    private readonly frequenciesService: FrequenciesService,
  ) {}

  async allTrains(query: TrainRouteDTO) {
    return Boolean(Object.keys(query).length)
      ? this.findTrainsByParams(query)
      : this.databaseService.findAll('trains', ['*'], {});
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
    train_uuid: number,
    frequencies: Frequencies[],
    trx: Knex.Transaction,
  ) {
    const frequenciesArray = [];
    for (let i = 0; i < frequencies.length; i++) {
      const frequency = await this.frequenciesService.findOne({
        frequency: frequencies[i],
      });
      frequenciesArray.push({
        train_id: train_uuid,
        frequency: frequency.frequency,
      });
    }
    await this.databaseService.createObj(
      'trains_frequencies',
      frequenciesArray,
      trx,
    );
  }

  async findTrainsByParams(query: TrainRouteDTO) {
    const { departure_station, arrival_station, departure_time } = query;

    const statements = await this.getDayOfWeek(departure_time);

    const arrivals = dbConf
      .select('T1.route_id')
      .from('arrivals AS T1')
      .whereIn('T1.station_id', [departure_station, arrival_station])
      .groupBy('T1.route_id')
      .having(dbConf.raw('COUNT("T1"."route_id")'), '>', '1')
      .andWhere(
        dbConf.raw(
          `(select consistency_number from arrivals AS "T2" where "T2"."station_id" = ? and "T1"."route_id" = "T2"."route_id")`,
          [departure_station],
        ),
        '<',
        dbConf.raw(
          `(select consistency_number from arrivals AS "T3" where "T3"."station_id" = ? and "T1"."route_id" = "T3"."route_id")`,
          [arrival_station],
        ),
      ); // returns the collection of arrivals objects where departure and arrival stations in one route and departure's consistency num less than arrival's consistency num

    return dbConf
      .select([
        'train_id',
        'number',
        'route_id',
        'departure_time',
        'train_type',
      ])
      .from('trains')
      .distinct('trains.number')
      .whereIn('trains.route_id', arrivals)
      .innerJoin('trains_frequencies', function () {
        this.on('trains.id', '=', 'trains_frequencies.train_id');
      })
      .whereIn('trains_frequencies.frequency', [...statements, 'daily']);
  }

  async getSchedule(train_number: string) {
    return this.scheduleService.getSchedule(train_number);
  }

  async getDayOfWeek(inputDate: any) {
    const date = new Date(inputDate);

    if (date.toString() === 'Invalid Date') {
      throw new BadRequestException();
    } else {
      const dayType = date.getDate() % 2 ? 'odd' : 'even';
      const dayOfWeek = DaysOfWeek[date.getDay()];

      return [dayType, dayOfWeek];
    }
  }

  async getTrains(station_uuid: string) {
    // returns the list of trains which pass via the received station
    return dbConf
      .select('trains.*')
      .from('trains')
      .innerJoin('routes', function () {
        this.on('routes.id', '=', 'trains.route_id');
      })
      .innerJoin('arrivals', function () {
        this.on('arrivals.route_id', '=', 'routes.id');
      })
      .where('arrivals.station_id', '=', station_uuid);
  }
}

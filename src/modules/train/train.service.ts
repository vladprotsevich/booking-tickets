import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { SeatService } from '../seat/seat.service';
import { CreateTrainDTO } from './dto/create-train.dto';
import { FrequencyService } from './frequency.service';
import { SchedulesService } from './schedule.service';
import { Train } from './models/train.model';
import { SearchTrainSeatsQueryDTO } from './dto/search-available-seats.dto';

@Injectable()
export class TrainService {
  constructor(
    private readonly seatService: SeatService,
    private readonly frequencyService: FrequencyService,
    private readonly scheduleService: SchedulesService,
  ) {}
  private qb() {
    return dbConf<Train>('trains');
  }

  async getAvailableTrains(query: SearchTrainSeatsQueryDTO) {
    const suitableTrains = await this.filterTrainsByFrequencies(
      query.departureDate,
    );
    return this.getTrainsByAvailableSeats(query, suitableTrains);
  }

  async getTrainAvailableSeats(query: SearchTrainSeatsQueryDTO) {
    const train = await this.findOne(query.train_id);
    return this.seatService.findAvailableSeats(query, train.route_id, false);
  }

  async findOne(id: string) {
    const train = await this.qb().where({ id }).first();
    if (train === undefined)
      throw new NotFoundException('Not Found', {
        description: 'Cannot find the train',
      });
    return train;
  }

  async getSchedule(train_id: string) {
    const train = await this.findOne(train_id);
    return this.scheduleService.getSchedule(
      train.route_id,
      train.departure_time,
    );
  }

  async getTrainsByRange(trains_id: string[]) {
    return this.qb().whereIn('id', trains_id);
  }

  async create(
    body: Omit<CreateTrainDTO, 'frequencies'>,
    trx: Knex.Transaction,
  ) {
    try {
      const [train] = await this.qb()
        .transacting(trx)
        .insert(body)
        .returning('*');
      return train;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getTrainsByAvailableSeats(
    query: SearchTrainSeatsQueryDTO,
    trains: Train[],
  ) {
    const trainIds: string[] = [];
    for (let i = 0; i < trains.length; i++) {
      query.train_id = trains[i].id;
      const availableSeats = await this.seatService.findAvailableSeats(
        query,
        trains[i].route_id,
        true,
      );
      availableSeats.length > 0 && trainIds.push(trains[i].id);
    }
    return this.getTrainsByRange(trainIds);
  }

  async getStationTrains(station_id: string): Promise<Train[]> {
    // returns the list of trains which pass via the received station
    try {
      const trains = await this.qb()
        .select('trains.*')
        .innerJoin('routes', 'routes.id', '=', 'trains.route_id')
        .innerJoin('arrivals', 'arrivals.route_id', '=', 'routes.id')
        .where({ station_id });
      return trains;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid data' });
    }
  }

  async filterTrainsByFrequencies(departureDate: string): Promise<Train[]> {
    const { dayType, dayOfWeek } = await this.frequencyService.getDayOfWeek(
      departureDate,
    );
    try {
      const trains = await this.qb()
        .distinct('trains.*')
        .innerJoin('frequencies', 'frequencies.train_id', '=', 'trains.id')
        .whereIn('frequencies.frequency', [dayType, dayOfWeek, 'daily']);
      return trains;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid departureDate' });
    }
  }

  async createTrain(dto: CreateTrainDTO) {
    const trx = await dbConf.transaction();
    try {
      const { frequencies, ...body } = dto;
      const train = await this.create(body, trx);
      const trainFrequencies =
        await this.frequencyService.createTrainsFrequency(
          train.id,
          frequencies,
          trx,
        );
      await trx.commit();
      train.frequencies = [...trainFrequencies];
      return train;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException({ message: 'Invalid data' }); //
    }
  }
}

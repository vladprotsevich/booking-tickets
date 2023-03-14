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
import { TrainScheduleService } from './train-schedule.service';
import { Train } from './models/train.model';
import { SearchTrainSeatsQueryDTO } from './dto/search-available-seats.dto';
import { FrequencyEnum } from '../../common/enums/frequency.enum';
import { Journey } from '../station/models/journey.model';
import { SearchAvailableTrainsQueryDTO } from './dto/search-available-trains.dto';

@Injectable()
export class TrainService {
  constructor(
    private readonly seatService: SeatService,
    private readonly frequencyService: FrequencyService,
    private readonly scheduleService: TrainScheduleService,
  ) {}
  private qb() {
    return dbConf<Train>('trains');
  }

  async findAll() {
    return this.qb();
  }

  async getAvailableTrains(query: SearchAvailableTrainsQueryDTO) {
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
    if (!train) {
      throw new NotFoundException('Not Found', {
        description: 'Cannot find the train',
      });
    }
    return train;
  }

  async findByRoute(route_id: string) {
    return this.qb().where({ route_id });
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

  async collectTrainArrivalTime(
    initialDepartureTime: string,
    journeyTimeCollection: Journey[],
  ) {
    const timeCollection: number[] = [];
    for (const { travel_time, stop_time } of journeyTimeCollection) {
      timeCollection.push(travel_time);
      timeCollection.push(stop_time);
    }

    const firstDepartureTime =
      this.scheduleService.convertTimeToMinutes(initialDepartureTime);

    return { firstDepartureTime, timeCollection };
  }

  async getTrainsByAvailableSeats(
    query: SearchTrainSeatsQueryDTO | SearchAvailableTrainsQueryDTO,
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
      if (availableSeats.length) trainIds.push(trains[i].id);
    }
    return this.getTrainsByRange(trainIds);
  }

  /**
   * returns the list of trains which pass via the received station
   * @param station_id
   * @returns Promise<Train[]>
   */
  async getStationTrains(station_id: string): Promise<Train[]> {
    try {
      const trains: Train[] = await this.qb()
        .select('trains.*')
        .innerJoin('arrivals', 'arrivals.route_id', '=', 'trains.route_id')
        .where({ station_id });
      return trains;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid data' });
    }
  }

  async filterTrainsByFrequencies(departureDate: string): Promise<Train[]> {
    const { dayType, dayOfWeek } =
      this.frequencyService.getDayOfWeek(departureDate);
    try {
      const trains = await this.qb()
        .distinct('trains.*')
        .innerJoin('frequencies', 'frequencies.train_id', '=', 'trains.id')
        .whereIn('frequencies.frequency', [
          dayType,
          dayOfWeek,
          FrequencyEnum.daily,
        ]);
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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { SearchOccupiedSeats } from '../seat/models/search-occupied-seats';
import { Journey } from '../station/models/journey.model';
import { CreateArrivalDTO } from './dto/arrival.create.dto';
import { Arrival } from './models/arrival.model';

@Injectable()
export class ArrivalService {
  private qb(table?: string) {
    table ||= 'arrivals';
    return dbConf<Arrival>(table);
  }

  async createArrival(body: CreateArrivalDTO) {
    try {
      const [arrival] = await this.qb().insert(body).returning('*');
      return arrival;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid Data' });
    }
  }

  async getArrivalsByRoute(route_id: string) {
    try {
      return this.qb().where({ route_id }).orderBy('order', 'asc');
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid Route Data' });
    }
  }

  async getJourneyCollectionByRoute(
    route_id: string,
    order: number,
  ) {
    try {
      const arrivals = await this.qb()
        .select('travel_time', 'stop_time')
        .where({ route_id })
        .andWhereBetween('order', [1, order]);
      return arrivals;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description: 'Cannot find the arrival with invalid data',
      });
    }
  }

  async getLastStationOrder(route_id: string) {
    try {
      const { order } = await this.qb()
        .where({ route_id })
        .orderBy('order', 'desc')
        .first();
      return order;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid data' });
    }
  }

  async getCurrentStationOrder(route_id: string, station_id: string) {
    try {
      const { order } = await this.qb().where({ route_id, station_id }).first();
      return order;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Invalid data' });
    }
  }

  async getPassingStationsRoutes(
    departureStation: string,
    arrivalStation: string,
  ): Promise<Pick<Arrival, 'route_id'>[]> {
    try {
      const arrivals = await this.qb('arrivals AS A1')
        .select('A1.route_id')
        .innerJoin('arrivals AS A2', 'A1.route_id', '=', 'A2.route_id')
        .where('A1.station_id', '=', departureStation)
        .andWhere('A2.station_id', '=', arrivalStation)
        .andWhere(dbConf.raw('"A1"."order" < "A2"."order"'));
      return arrivals;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description:
          'Cannot find the passing stations for the route with invalid data',
      });
    }
  }

  async findArrivalStations(
    args: Omit<SearchOccupiedSeats, 'departureOrder' | 'arrivalOrder'>,
    order: number,
    less: boolean,
  ) {
    try {
      const stations = await this.qb()
        .select('station_id')
        .where('route_id', '=', args.route_id) // .where({ route_id: args.route_id })
        .andWhere('order', less ? '<' : '>', order);
      return stations.map(station => station.station_id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description: 'Cannot find the arrival stations with invalid data',
      });
    }
  }
}

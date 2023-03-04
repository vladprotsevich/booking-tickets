import { Injectable } from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { Arrivals } from './models/arrivals.model';

@Injectable()
export class ArrivalsService {
  qb(table?: string) {
    table ||= 'arrivals';
    return dbConf<Arrivals>(table);
  }

  async createArrival(body: CreateArrivalDTO): Promise<Arrivals> {
    const arrival = this.qb().insert(body).returning('*');
    return arrival[0];
  }

  async getArrivalsByRoute(route_id: string) {
    return this.qb().where({ route_id }).orderBy('order', 'asc');
  }

  async getJourneyCollectionByRoute(
    route_id: string,
    order: number,
  ) {
    return this.qb()
      .select('station_id', 'travel_time', 'stop_time')
      .where({ route_id })
      .andWhereBetween('order', [1, order]);
  }

  async getLastStationOrder(route_id: string): Promise<Arrivals> {
    return this.qb().where({ route_id }).orderBy('order', 'desc').first();
  }

  async getCurrentStationOrder(
    route_id: string,
    station_id: string,
  ) {
    const { order } = await this.qb()
      .select('order')
      .where({ route_id, station_id })
      .first();
    return order;
  }

  async getPassingStationsRoutes(
    departureStation: string,
    arrivalStation: string,
  ): Promise<Arrivals[]> {
    return this.qb('arrivals AS A1')
      .select('route_id')
      .innerJoin('arrivals AS A2', 'A1.route_id', '=', 'A2.route_id')
      .where('A1.station_id', '=', departureStation)
      .andWhere('A2.station_id', '=', arrivalStation)
      .andWhere('A1.order', '<', 'A2.order');
  }
}

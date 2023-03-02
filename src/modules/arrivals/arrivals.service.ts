import { Injectable } from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';

@Injectable()
export class ArrivalsService {
  async getRoutesArrivalsCollection(routeUUID: string) {
    return dbConf
      .select('*')
      .from('arrivals')
      .where('route_id', routeUUID)
      .orderBy('order', 'asc');
  }

  async getJourneyTimeCollection(routeUUID: string, order: number) {
    return dbConf
      .select('station_id', 'travel_time', 'stop_time')
      .from('arrivals')
      .where('arrivals.route_id', routeUUID)
      .andWhereBetween('arrivals.order', [1, order]);
  }

  async getStationsOrders(routeUUID: string) {
    return dbConf
      .select('arrivals.order', 'station_id')
      .from('arrivals')
      .andWhere('arrivals.route_id', '=', routeUUID)
      .orderBy('arrivals.order', 'asc');
  }

  async getLastStationOrder(routeUUID: string) {
    const arrivals = await this.getStationsOrders(routeUUID);
    return arrivals[arrivals.length - 1].order;
  }

  async getCurrentStationOrder(routeUUID: string, stationUUID: string) {
    const arrivals = await this.getStationsOrders(routeUUID);
    return arrivals.filter((arrival) => arrival.station_id === stationUUID)[0]
      .order;
  }

  async getPassingStationsRoutes(
    departureStation: string,
    arrivalStation: string,
  ) {
    const arrivals = await dbConf
      .select('T1.route_id')
      .from('arrivals AS T1')
      .whereIn('T1.station_id', [departureStation, arrivalStation])
      .groupBy('T1.route_id')
      .having(dbConf.raw('COUNT("T1"."route_id")'), '>', '1')
      .andWhere(
        dbConf.raw(
          `(select "T2"."order" from arrivals AS "T2" where "T2"."station_id" = ? and "T1"."route_id" = "T2"."route_id")`,
          [departureStation],
        ),
        '<',
        dbConf.raw(
          `(select "T3"."order" from arrivals AS "T3" where "T3"."station_id" = ? and "T1"."route_id" = "T3"."route_id")`,
          [arrivalStation],
        ),
      )
      .returning('*'); // * returns the collection of arrivals objects where departure and arrival stations in one route and departure's order less than arrival's order
    return arrivals.map((arrival) => arrival.route_id);
  }
}

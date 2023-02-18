import { Injectable } from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';

@Injectable()
export class ArrivalsService {
  async getRoutesArrivalsCollection(route_uuid: string) {
    return dbConf
      .select('*')
      .from('arrivals')
      .where('route_id', route_uuid)
      .orderBy('consistency_number', 'asc');
  }

  async getJourneyTimeCollection(
    train_uuid: string,
    consistencyNumber: number,
  ) {
    return dbConf
      .select('station_id', 'travel_time', 'stop_time')
      .from('arrivals')
      .innerJoin('routes', function () {
        this.on('routes.id', '=', 'arrivals.route_id');
      })
      .innerJoin('trains', function () {
        this.on('trains.route_id', '=', 'routes.id');
      })
      .andWhere('trains.id', '=', train_uuid)
      .andWhereBetween('arrivals.consistency_number', [1, consistencyNumber]);
  }

  async getConsistencyNumOfStation(train_uuid: string) {
    return dbConf
      .select('consistency_number', 'station_id')
      .from('arrivals')
      .innerJoin('routes', function () {
        this.on('routes.id', '=', 'arrivals.route_id');
      })
      .innerJoin('trains', function () {
        this.on('routes.id', '=', 'trains.route_id');
      })
      .andWhere('trains.id', '=', train_uuid)
      .orderBy('consistency_number', 'asc');
  }

  async getLastOrderNumberOfStation(train_uuid: string, station_uuid: string) {
    const arrivals = await this.getConsistencyNumOfStation(train_uuid);
    return arrivals[arrivals.length - 1].consistency_number;
  }

  async getCurrentOrderNumberOfStation(
    train_uuid: string,
    station_uuid: string,
  ) {
    const arrivals = await this.getConsistencyNumOfStation(train_uuid);
    return arrivals.filter((arrival) => arrival.station_id === station_uuid)[0]
      .consistency_number;
  }
}

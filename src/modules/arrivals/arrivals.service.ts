import { Injectable } from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';

@Injectable()
export class ArrivalsService {
  async getRoutesArrivalsInfo(route_uuid: string) {
    return dbConf
      .select('*')
      .from('arrivals')
      .where('route_id', route_uuid)
      .orderBy('consistency_number', 'asc');
  }

  async getArrivalTime(train_uuid: string, consistencyNumber: number) {
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

  async getConsistencyNumOfStation(
    train_uuid: string,
    station_uuid: string,
    isLast?: boolean,
  ) {
    // returns the consistency num of station in for specific trains route which u passed in params
    const consistencyNumber = dbConf
      .select('consistency_number')
      .from('arrivals')
      .innerJoin('routes', function () {
        this.on('routes.id', '=', 'arrivals.route_id');
      })
      .innerJoin('trains', function () {
        this.on('routes.id', '=', 'trains.route_id');
      })
      .andWhere('trains.id', '=', train_uuid);
    return isLast
      ? consistencyNumber.orderBy('consistency_number', 'desc').first()
      : consistencyNumber
          .andWhere('arrivals.station_id', '=', station_uuid)
          .first();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { CreateRouteDTO } from './dto/create.route.dto';
import { dbConf } from 'src/db/knexfile';

@Injectable()
export class RoutesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async allRoutes() {
    return this.databaseService.findAll('routes', ['*'], {});
  }

  async createRoute(routeBody: CreateRouteDTO) {
    return this.databaseService.createObj('routes', routeBody);
  }

  async addStation(body: CreateArrivalDTO) {
    return this.databaseService.createObj('arrivals', body);
  }

  async nestedStations(route_uuid: string) {
    try {
      return dbConf('stations')
        .innerJoin('arrivals', function () {
          this.on('stations.id', '=', 'arrivals.station_id');
        })
        .where('arrivals.route_id', route_uuid)
        .select('stations.id', 'stations.name');
    } catch {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: 'Cannot find nested stations for the route',
      });
    }
  }
}

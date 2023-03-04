import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { CreateRouteDTO } from './dto/create.route.dto';
import { dbConf } from 'src/db/knexfile';
import { Routes } from './models/routes.model';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { Arrivals } from '../arrivals/models/arrivals.model';

@Injectable()
export class RoutesService {
  constructor(private readonly arrivalsService: ArrivalsService) {}

  qb(table?: string) {
    table ||= 'routes';
    return dbConf(table);
  }

  async allRoutes(): Promise<Routes[]> {
    return this.qb();
  }

  async createRoute(body: CreateRouteDTO): Promise<Routes> {
    const route = this.qb().insert(body).returning('*');
    return route[0];
  }

  async addStation(body: CreateArrivalDTO): Promise<Arrivals> {
    return this.arrivalsService.createArrival(body);
  }

  async nestedStations(route_id: string) {
    // in process
    try {
      return dbConf('stations')
        .innerJoin('arrivals', function () {
          this.on('stations.id', '=', 'arrivals.station_id');
        })
        .where('arrivals.route_id', route_id)
        .select('stations.id', 'stations.name', 'arrivals.order');
    } catch {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: 'Cannot find nested stations for the route',
      });
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArrivalDTO } from '../arrival/dto/arrival.create.dto';
import { CreateRouteDTO } from './dto/create-route.dto';
import { dbConf } from 'src/db/knexfile';
import { Route } from './models/route.model';
import { ArrivalService } from '../arrival/arrivals.service';
import { StationService } from '../station/station.service';

@Injectable()
export class RouteService {
  constructor(
    private readonly arrivalService: ArrivalService,
    private readonly stationService: StationService,
  ) {}
  private qb() {
    return dbConf<Route>('routes');
  }

  async getAllRoutes() {
    return this.qb();
  }

  async createRoute(body: CreateRouteDTO) {
    try {
      const [route] = await this.qb().insert(body).returning('*');
      return route;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create the route',
      });
    }
  }

  async addStation(body: CreateArrivalDTO) {
    return this.arrivalService.createArrival(body);
  }

  async routeStations(route_id: string) {
    return this.stationService.findStationsByRoute(route_id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { StationsService } from '../stations/stations.service';
import { CreateRouteDTO } from './dto/create.route.dto';
import { RouteDTO } from './dto/route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly stationsService: StationsService) {}
  async allRoutes() {
    return await dbConf('routes').select('*').returning('*');
  }

  async createRoute(routeBody: CreateRouteDTO): Promise<RouteDTO> {
    try {
      const route: RouteDTO[] = await dbConf('routes')
        .insert({ name: routeBody.name })
        .returning('*');
      return route[0];
    } catch {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: 'Cannot create a route with invalid data',
      });
    }
  }

  async findRouteBy(attr: string, attrValue: string | number) {
    try {
      return await dbConf('routes')
        .where(attr, attrValue)
        .returning('*')
        .first();
    } catch {
      throw new NotFoundException('Not found', {
        cause: new Error(),
        description:
          'The record cannot be found in database with invalid received data',
      });
    }
  }

  async addStation(body: CreateArrivalDTO) {
    try {
      const route = await this.findRouteBy('name', body.route);
      const station = await this.stationsService.findStationBy(
        'name',
        body.station,
      );
      return await dbConf('arrivals')
        .insert({
          route_id: route.id,
          station_id: station.id,
          departure_time: body.departure_time,
          arrival_time: body.arrival_time,
        })
        .returning('*');
    } catch {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: 'Cannot add the station to the route',
      });
    }
  }

  async nestedStations(route_id: string | number) {
    try {
      return await dbConf('stations')
        .innerJoin('arrivals', function () {
          this.on('stations.id', '=', 'arrivals.station_id');
        })
        .innerJoin('routes', function () {
          this.on('arrivals.route_id', '=', 'routes.id');
        })
        .where('routes.id', route_id)
        .select('stations.id', 'stations.name');
    } catch {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: 'Cannot find nested stations for the route',
      });
    }
  }
}

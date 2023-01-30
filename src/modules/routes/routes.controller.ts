import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { CreateRouteDTO } from './dto/create.route.dto';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('index')
  async index() {
    const routes = await this.routesService.allRoutes();
    return { routes };
  }

  @Post('create')
  async create(@Body() body: CreateRouteDTO) {
    const route = await this.routesService.createRoute(body);
    return { route };
  }

  @Post('add-station')
  async addStation(@Body() body: CreateArrivalDTO) {
    return await this.routesService.addStation(body);
  }

  @Get(':id/stations')
  async getRoutesStations(@Param() params) {
    const route = await this.routesService.findRouteBy('id', params.id);
    const stations = await this.routesService.nestedStations(params.id);
    route['stations'] = stations;
    return { route };
  }
}

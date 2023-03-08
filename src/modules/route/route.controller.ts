import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateArrivalDTO } from '../arrival/dto/arrival.create.dto';
import { CreateRouteDTO } from './dto/create-route.dto';
import { RouteService } from './route.service';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @ApiCreatedResponse({
    description: 'Routes list',
  })
  @Get('/')
  async allRoutes() {
    return this.routeService.getAllRoutes();
  }

  @ApiCreatedResponse({
    description: 'The route is created',
  })
  @Post('/')
  async create(@Body() body: CreateRouteDTO) {
    return this.routeService.createRoute(body);
  }

  @ApiCreatedResponse({
    description: 'The station is added',
  })
  @Post('/add-station')
  async addStation(@Body() body: CreateArrivalDTO) {
    return this.routeService.addStation(body);
  }

  @ApiCreatedResponse({
    description: 'Route stations list',
  })
  @Get('/:uuid/stations')
  async getRoutesStations(
    @Param('uuid')
    route_id: string,
  ) {
    return this.routeService.routeStations(route_id);
  }
}

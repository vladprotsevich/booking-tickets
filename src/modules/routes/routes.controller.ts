import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { CreateRouteDTO } from './dto/create.route.dto';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @ApiCreatedResponse({
    description: 'All routes',
  })
  @Get('/')
  async index() {
    const routes = await this.routesService.allRoutes();
    return { routes };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
  })
  @Post('/')
  async create(@Body() body: CreateRouteDTO) {
    const route = await this.routesService.createRoute(body);
    return { route };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
  })
  @Post('/add-station')
  async addStation(@Body() body: CreateArrivalDTO) {
    return this.routesService.addStation(body);
  }

  @Get('/:uuid/stations')
  async getRoutesStations(
    @Param('uuid')
    routeUUID: string,
  ) {
    const stations = await this.routesService.nestedStations(routeUUID);
    return { stations };
  }
}

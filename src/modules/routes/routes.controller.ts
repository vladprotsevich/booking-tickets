import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArrivalDTO } from '../stations/dto/create.arrival.dto';
import { CreateRouteDTO } from './dto/create.route.dto';
import { RouteDTO } from './dto/route.dto';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @ApiCreatedResponse({
    description: 'All routes',
    type: [RouteDTO],
  })
  @Get('/')
  async index() {
    const routes = await this.routesService.allRoutes();
    return { routes };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
    type: CreateRouteDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/')
  async create(@Body() body: CreateRouteDTO) {
    const route = await this.routesService.createRoute(body);
    return { route };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
    type: CreateArrivalDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/add-station')
  async addStation(@Body() body: CreateArrivalDTO) {
    return await this.routesService.addStation(body);
  }

  @Get('/:uuid/stations')
  async getRoutesStations(
    @Param(
      'uuid',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    route_uuid: string,
  ) {
    const stations = await this.routesService.nestedStations(route_uuid);
    return { stations };
  }
}

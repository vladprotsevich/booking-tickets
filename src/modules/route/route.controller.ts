import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateArrivalDTO } from '../arrival/dto/create-arrival.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateRouteDTO } from './dto/create-route.dto';
import { RouteService } from './route.service';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @ApiCreatedResponse({ description: 'Routes list' })
  @Roles('Admin', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async allRoutes() {
    return this.routeService.getAllRoutes();
  }

  @ApiCreatedResponse({ description: 'The route is created' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateRouteDTO) {
    return this.routeService.createRoute(body);
  }

  @ApiCreatedResponse({ description: 'The station is added' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/add-station')
  async addStation(@Body() body: CreateArrivalDTO) {
    return this.routeService.addStation(body);
  }

  @ApiCreatedResponse({ description: 'Route stations list' })
  @Roles('Admin', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:id/stations')
  async getRoutesStations(
    @Param('id')
    route_id: string,
  ) {
    return this.routeService.routeStations(route_id);
  }

  @ApiCreatedResponse({ description: 'Trains list' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/trains')
  async findTrainsByRoute(@Param('id') route_id: string) {
    return this.routeService.findTrainsByRoute(route_id);
  }
}

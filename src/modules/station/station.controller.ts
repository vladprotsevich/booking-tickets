import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { StationService } from './station.service';

@ApiTags('Station')
@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @ApiCreatedResponse({ description: 'Stations list' })
  @Roles('Admin', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async allStations() {
    return this.stationService.getAllStations();
  }

  @ApiCreatedResponse({ description: 'The record is created' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateStationDTO) {
    return this.stationService.createStation(body);
  }

  @ApiCreatedResponse({ description: 'The record is updated' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/')
  async update(@Body('id') station_id: string, @Body() body: UpdateStationDTO) {
    return this.stationService.updateStation(station_id, body);
  }

  @ApiCreatedResponse({ description: 'Station schedule' })
  @UseGuards(JwtAuthGuard)
  @Get('/:id/schedule')
  async stationSchedule(@Param('id') station_id: string) {
    const trains = await this.stationService.getSchedule(station_id);
    return { schedule: { trains } };
  }
}

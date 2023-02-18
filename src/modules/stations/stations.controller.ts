import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateStationDTO } from './dto/create.station.dto';
import { StationDTO } from './dto/station.dto';
import { UpdateStationDTO } from './dto/update.station.dto';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @ApiCreatedResponse({
    description: 'Stations list',
  })
  @Get('/')
  async index() {
    const stations = await this.stationsService.allStations();
    return { stations };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
    type: CreateStationDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/')
  async create(@Body() body: CreateStationDTO) {
    const station = await this.stationsService.createStation(body);
    return { station };
  }

  @ApiCreatedResponse({
    description: 'The record is created',
    type: UpdateStationDTO,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Put('/')
  async update(@Body() body: StationDTO) {
    return await this.stationsService.updateStation(body);
  }

  @Get('/:id/schedule')
  async stationSchedule(@Param('id') schedule_uuid: string) {
    const trains = await this.stationsService.getSchedule(schedule_uuid);
    return { schedule: { trains } };
  }
}

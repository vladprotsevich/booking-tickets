import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { StationService } from './station.service';

@ApiTags('Station')
@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @ApiCreatedResponse({
    description: 'Stations list',
  })
  @Get('/')
  async allStations() {
    return this.stationService.getAllStations();
  }

  @ApiCreatedResponse({
    description: 'The record is created',
  })
  @Post('/')
  async create(@Body() body: CreateStationDTO) {
    return this.stationService.createStation(body);
  }

  @ApiCreatedResponse({
    description: 'The record is created',
  })
  @Patch('/')
  async update(@Body('id') station_id: string, @Body() body: UpdateStationDTO) {
    return this.stationService.updateStation(station_id, body);
  }

  @Get('/:id/schedule')
  async stationSchedule(@Param('id') station_id: string) {
    const trains = await this.stationService.getSchedule(station_id);
    return { schedule: { trains } };
  }
}

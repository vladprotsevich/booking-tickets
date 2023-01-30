import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateArrivalDTO } from './dto/create.arrival.dto';
import { CreateStationDTO } from './dto/create.station.dto';
import { StationDTO } from './dto/station.dto';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get('index')
  async index() {
    const stations = await this.stationsService.allStations();
    return { stations };
  }

  @Post('create')
  async create(@Body() body: CreateStationDTO) {
    const station = await this.stationsService.createStation(body);
    return { station };
  }

  @Put('update')
  async updateStation(@Body() body: StationDTO) {
    return await this.stationsService.updateStation(body);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTrainDTO } from './dto/create.train.dto';
import { TrainRouteDTO } from './dto/trains.route.dto';
import { TrainsService } from './trains.service';

@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Get('/')
  async index(@Query() query: TrainRouteDTO) {
    const trains = await this.trainsService.allTrains(query);
    return { trains };
  }

  @Post('/')
  async create(@Body() body: CreateTrainDTO) {
    const train = await this.trainsService.createTrain(body);
    return { train };
  }

  @Get('/:uuid/schedule')
  async trainsSchedule(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    return await this.trainsService.getSchedule(uuid);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateTrainDTO } from './dto/create.train.dto';
import { SearchTrainsByParamsDTO } from './dto/search.trains.by.params.dto';
import { TrainsService } from './trains.service';

@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Roles('Passenger')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async index(@Query() query: SearchTrainsByParamsDTO) {
    const trains = await this.trainsService.getAvailableTrains(query);
    return { trains };
  }

  @Post('/')
  async create(@Body() body: CreateTrainDTO) {
    const train = await this.trainsService.createTrain(body);
    return { train };
  }

  @Get('/:number/schedule')
  async trainsSchedule(@Param('number') train_number: string) {
    return await this.trainsService.getSchedule(train_number);
  }
}

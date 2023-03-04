import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateTrainDTO } from './dto/create.train.dto';
import { SearchTrainQueryDTO } from './dto/search.train.query.dto';
import { TrainsService } from './trains.service';

@ApiTags('Trains')
@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @ApiCreatedResponse({
    description: 'Trains list',
    status: 200,
    type: SearchTrainQueryDTO,
  })
  // @Roles('Passenger', 'Manager')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async index(@Query() query: SearchTrainQueryDTO) {
    const trains = await this.trainsService.getAvailableTrains(query);
    return { trains };
  }

  @ApiCreatedResponse({
    description: 'Train is created',
    status: 201,
    type: CreateTrainDTO,
  })
  // @Roles('Manager')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateTrainDTO) {
    return this.trainsService.createTrain(body);
  }

  @ApiCreatedResponse({
    description: 'Train schedule',
    status: 200,
  })
  // @Roles('Manager')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:uuid/schedule')
  async trainsSchedule(@Param('uuid') train_id: string) {
    return this.trainsService.getSchedule(train_id);
  }
}

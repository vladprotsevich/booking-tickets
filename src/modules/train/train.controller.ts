import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateTrainDTO } from './dto/create-train.dto';
import { SearchTrainSeatsQueryDTO } from './dto/search-available-seats.dto';
import { TrainService } from './train.service';

@ApiBearerAuth()
@ApiTags('Trains')
@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @ApiCreatedResponse({
    description: 'Trains list',
    status: 200,
    type: SearchTrainSeatsQueryDTO,
  })
  // @Roles('Passenger', 'Manager')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async index(@Query() query: SearchTrainSeatsQueryDTO) {
    const trains = await this.trainService.getAvailableTrains(query);
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
  @UseFilters(HttpExceptionFilter)
  async create(@Body() body: CreateTrainDTO) {
    return this.trainService.createTrain(body);
  }

  @Get('/find-train-available-seats')
  async findTrainAvailableSeats(@Query() query: SearchTrainSeatsQueryDTO) {
    return this.trainService.getTrainAvailableSeats(query);
  }

  @ApiCreatedResponse({
    description: 'Train schedule',
    status: 200,
  })
  // // @Roles('Manager')
  // // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:uuid/schedule')
  async trainsSchedule(@Param('uuid') train_id: string) {
    return this.trainService.getSchedule(train_id);
  }
}

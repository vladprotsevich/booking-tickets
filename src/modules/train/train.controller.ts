import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTrainDTO } from './dto/create-train.dto';
import { SearchTrainSeatsQueryDTO } from './dto/search-available-seats.dto';
import { SearchAvailableTrainsQueryDTO } from './dto/search-available-trains.dto';
import { TrainService } from './train.service';

@ApiBearerAuth()
@ApiTags('Trains')
@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @ApiCreatedResponse({ description: 'Trains list' })
  @Roles('Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/find-all')
  async getAllTrain() {
    return this.trainService.findAll();
  }

  @ApiCreatedResponse({ description: 'Trains list' })
  @Roles('Passenger', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getTrainsByQuery(@Query() query: SearchAvailableTrainsQueryDTO) {
    const trains = await this.trainService.getAvailableTrains(query);
    return { trains };
  }

  @ApiCreatedResponse({ description: 'Train is created' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateTrainDTO) {
    return this.trainService.createTrain(body);
  }

  @ApiCreatedResponse({ description: 'Train available seats list' })
  @Roles('Passenger', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/find-train-available-seats')
  async findTrainAvailableSeats(@Query() query: SearchTrainSeatsQueryDTO) {
    return this.trainService.getTrainAvailableSeats(query);
  }

  @ApiCreatedResponse({ description: 'Train schedule' })
  @Roles('Manager', 'Train Master')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:uuid/schedule')
  async trainsSchedule(@Param('uuid') train_id: string) {
    return this.trainService.getSchedule(train_id);
  }
}

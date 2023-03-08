import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CarriageService } from './carriage.service';
import { CreateCarriageDTO } from './dto/create-carriage.dto';

@ApiTags('Carriage')
@Controller('carriage')
export class CarriageController {
  constructor(private readonly carriageService: CarriageService) {}

  @ApiCreatedResponse({
    description: 'Carriage is created',
  })
  @Post('/')
  async create(@Body() body: CreateCarriageDTO) {
    return this.carriageService.createCarriage(body);
  }
}

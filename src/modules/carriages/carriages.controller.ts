import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CarriagesService } from './carriages.service';
import { CreateCarriageDTO } from './dto/create.carriage.dto';

@ApiTags('Carriages')
@Controller('carriages')
export class CarriagesController {
  constructor(private readonly carriagesService: CarriagesService) {}

  @ApiCreatedResponse({
    description: 'Carriage is created',
    status: 200,
    type: CreateCarriageDTO,
  })
  @Post('/')
  async create(@Body() body: CreateCarriageDTO) {
    return this.carriagesService.createCarriage(body);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { CarriagesService } from './carriages.service';
import { CreateCarriageDTO } from './dto/create.carriage.dto';

@Controller('carriages')
export class CarriagesController {
  constructor(private readonly carriagesService: CarriagesService) {}

  @Post('/')
  async create(@Body() body: CreateCarriageDTO) {
    return this.carriagesService.createCarriage(body);
  }
}

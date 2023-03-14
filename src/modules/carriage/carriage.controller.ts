import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarriageService } from './carriage.service';
import { CreateCarriageDTO } from './dto/create-carriage.dto';

@ApiTags('Carriage')
@Controller('carriage')
export class CarriageController {
  constructor(private readonly carriageService: CarriageService) {}

  @ApiCreatedResponse({ description: 'Carriage is created' })
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/')
  async create(@Body() body: CreateCarriageDTO) {
    return this.carriageService.createCarriage(body);
  }

  @ApiCreatedResponse({ description: 'Carriages list' })
  @Roles('Admin', 'Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('train/:id')
  async findCarriage(@Param('id') train_id: string) {
    return this.carriageService.findCarriagesByTrain(train_id);
  }
}

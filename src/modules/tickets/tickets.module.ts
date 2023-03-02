import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TrainsModule } from '../trains/trains.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CarriagesModule } from '../carriages/carriages.module';
import { PricesService } from './prices.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TrainsModule, ArrivalsModule, CarriagesModule, DatabaseModule],
  providers: [TicketsService, PricesService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}

import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TrainModule } from '../train/train.module';
import { ArrivalModule } from '../arrival/arrival.module';
import { CarriageModule } from '../carriage/carriage.module';
import { PriceService } from './price.service';
import { SeatModule } from '../seat/seat.module';
import { FrequencyService } from '../train/frequency.service';

@Module({
  imports: [TrainModule, ArrivalModule, CarriageModule, SeatModule],
  providers: [PriceService, TicketService, FrequencyService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}

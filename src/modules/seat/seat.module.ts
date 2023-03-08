import { Module } from '@nestjs/common';
import { ArrivalModule } from '../arrival/arrival.module';
import { SeatService } from './seat.service';

@Module({
  imports: [ArrivalModule],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}

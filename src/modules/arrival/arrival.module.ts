import { Module } from '@nestjs/common';
import { ArrivalService } from './arrivals.service';

@Module({
  providers: [ArrivalService],
  exports: [ArrivalService],
})
export class ArrivalModule {}

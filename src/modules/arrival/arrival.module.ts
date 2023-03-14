import { Module } from '@nestjs/common';
import { ArrivalService } from './arrival.service';

@Module({
  providers: [ArrivalService],
  exports: [ArrivalService],
})
export class ArrivalModule {}

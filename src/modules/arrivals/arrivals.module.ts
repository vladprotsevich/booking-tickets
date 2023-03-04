import { Module } from '@nestjs/common';
import { ArrivalsService } from './arrivals.service';

@Module({
  providers: [ArrivalsService],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}

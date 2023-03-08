import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { SchedulesService } from './schedule.service';
import { FrequencyService } from './frequency.service';
import { ArrivalModule } from '../arrival/arrival.module';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [ArrivalModule, SeatModule],
  providers: [TrainService, SchedulesService, FrequencyService],
  controllers: [TrainController],
  exports: [TrainService, SchedulesService],
})
export class TrainModule {}

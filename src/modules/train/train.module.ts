import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { TrainScheduleService } from './train-schedule.service';
import { FrequencyService } from './frequency.service';
import { ArrivalModule } from '../arrival/arrival.module';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [ArrivalModule, SeatModule],
  providers: [TrainService, TrainScheduleService, FrequencyService],
  controllers: [TrainController],
  exports: [TrainService, TrainScheduleService],
})
export class TrainModule {}

import { Module } from '@nestjs/common';
import { ArrivalModule } from '../arrival/arrival.module';
import { TrainModule } from '../train/train.module';
import { StationController } from './station.controller';
import { StationService } from './station.service';

@Module({
  imports: [TrainModule, ArrivalModule],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}

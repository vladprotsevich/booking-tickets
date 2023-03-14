import { Module } from '@nestjs/common';
import { ArrivalModule } from '../arrival/arrival.module';
import { StationModule } from '../station/station.module';
import { TrainModule } from '../train/train.module';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [ArrivalModule, StationModule, TrainModule],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}

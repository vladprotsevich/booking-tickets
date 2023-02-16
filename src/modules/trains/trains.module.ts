import { Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { SchedulesService } from './schedule.service';
import { DatabaseModule } from '../database/database.module';
import { FrequenciesService } from './frequencies.service';
import { ArrivalsModule } from '../arrivals/arrivals.module';

@Module({
  imports: [DatabaseModule, ArrivalsModule],
  providers: [TrainsService, SchedulesService, FrequenciesService],
  controllers: [TrainsController],
  exports: [TrainsService, SchedulesService],
})
export class TrainsModule {}

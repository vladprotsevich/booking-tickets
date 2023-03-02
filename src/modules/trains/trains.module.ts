import { forwardRef, Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { SchedulesService } from './schedule.service';
import { DatabaseModule } from '../database/database.module';
import { FrequenciesService } from './frequencies.service';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CarriagesModule } from '../carriages/carriages.module';

@Module({
  imports: [DatabaseModule, ArrivalsModule, forwardRef(() => CarriagesModule)],
  providers: [TrainsService, SchedulesService, FrequenciesService],
  controllers: [TrainsController],
  exports: [TrainsService, SchedulesService],
})
export class TrainsModule {}

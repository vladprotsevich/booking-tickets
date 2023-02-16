import { Module } from '@nestjs/common';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { DatabaseModule } from '../database/database.module';
import { TrainsModule } from '../trains/trains.module';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

@Module({
  imports: [DatabaseModule, TrainsModule, ArrivalsModule],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}

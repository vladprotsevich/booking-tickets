import { forwardRef, Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CarriagesController } from './carriages.controller';
import { CarriagesService } from './carriages.service';
import { TrainsModule } from '../trains/trains.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';

@Module({
  imports: [forwardRef(() => TrainsModule), ArrivalsModule],
  controllers: [CarriagesController],
  providers: [CarriagesService, SeatsService],
  exports: [CarriagesService, SeatsService],
})
export class CarriagesModule {}

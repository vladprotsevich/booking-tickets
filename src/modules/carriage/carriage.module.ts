import { Module } from '@nestjs/common';
import { CarriageController } from './carriage.controller';
import { CarriageService } from './carriage.service';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [SeatModule],
  controllers: [CarriageController],
  providers: [CarriageService],
  exports: [CarriageService],
})
export class CarriageModule {}

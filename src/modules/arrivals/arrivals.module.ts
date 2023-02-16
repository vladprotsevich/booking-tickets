import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ArrivalsService } from './arrivals.service';

@Module({
  imports: [DatabaseModule],
  providers: [ArrivalsService],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}

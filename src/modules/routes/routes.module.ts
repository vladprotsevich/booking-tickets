import { Module } from '@nestjs/common';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [ArrivalsModule],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}

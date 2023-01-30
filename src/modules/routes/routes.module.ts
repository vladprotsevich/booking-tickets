import { Module } from '@nestjs/common';
import { StationsModule } from '../stations/stations.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [StationsModule],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService, StationsModule],
})
export class RoutesModule {}

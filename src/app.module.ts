import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RouteModule } from './modules/route/route.module';
import { StationModule } from './modules/station/station.module';
import { TrainModule } from './modules/train/train.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { CarriageModule } from './modules/carriage/carriage.module';

import configuration from './configuration/token.configuration';
import { SeatModule } from './modules/seat/seat.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    RouteModule,
    SeatModule,
    StationModule,
    TrainModule,
    TicketModule,
    CarriageModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}

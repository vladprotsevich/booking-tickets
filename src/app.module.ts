import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoutesModule } from './modules/routes/routes.module';
import { StationsModule } from './modules/stations/stations.module';
import { TrainsModule } from './modules/trains/trains.module';
import configuration from './configuration/token.configuration';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RoutesModule,
    StationsModule,
    TrainsModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

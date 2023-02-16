import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { TrainsService } from './trains.service';

@Injectable()
export class SchedulesService {
  constructor(
    @Inject(forwardRef(() => TrainsService))
    private readonly trainsService: TrainsService,
    private readonly arrivalsService: ArrivalsService,
  ) {}

  async getSchedule(id: string) {
    const train = await this.trainsService.findOne({ id });
    const arrivals = await this.arrivalsService.getRoutesArrivalsInfo(
      train.route_id,
    );

    const schedulesSubRoutes = [];

    const travelTimeSequence = [train.departure_time];
    for (let i = 0; i < arrivals.length - 1; i++) {
      let nextStationArrivalTime = this.getTravelTime([
        travelTimeSequence[i],
        arrivals[i + 1].travel_time,
        arrivals[i].stop_time,
      ]);

      const departureTimeWithStopTime = this.getTravelTime([
        travelTimeSequence[i],
        arrivals[i].stop_time,
      ]);

      travelTimeSequence.push(nextStationArrivalTime);

      schedulesSubRoutes.push({
        departure_station: arrivals[i].station_id,
        arrival_station: arrivals[i + 1].station_id,
        departure_time: departureTimeWithStopTime,
        arrival_time: travelTimeSequence[i + 1],
        stop_time: arrivals[i].stop_time,
      });
    }

    return schedulesSubRoutes;
  }

  getTravelTime(times: string[]) {
    let totalTime = 0;
    times.forEach((time) => {
      totalTime += this.convertTimeToMilliseconds(time);
    });

    return this.convertMillisecondsToFullTime(totalTime);
  }

  convertTimeToMilliseconds(time: string) {
    const oneMinuteInMill = 60000;
    const oneHourInMill = 3600000;

    const timeArray = time.split(':').map((x) => Number(x));
    const timeHours: number = timeArray[0];
    const timeMinutes: number = timeArray[1];

    const timeMilliseconds =
      timeHours * oneHourInMill + timeMinutes * oneMinuteInMill;

    return timeMilliseconds;
  }

  convertMillisecondsToFullTime(millisec: number): string {
    const hours = `0${Math.abs(new Date(millisec).getHours() - 3)}`.slice(-2);
    const minutes = `0${new Date(millisec).getMinutes()}`.slice(-2);
    const seconds = `0${new Date(millisec).getSeconds()}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }
}

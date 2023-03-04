import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { Schedule } from './interfaces/schedule.interface';
import { TrainsService } from './trains.service';

@Injectable()
export class SchedulesService {
  constructor(
    @Inject(forwardRef(() => TrainsService))
    private readonly trainsService: TrainsService,
    private readonly arrivalsService: ArrivalsService,
  ) {}

  async getSchedule(train_id: string): Promise<Schedule[]> {
    const train = await this.trainsService.findOne(train_id);
    const arrivals = await this.arrivalsService.getArrivalsByRoute(
      train.route_id,
    );

    const schedulesSubRoutes: Schedule[] = [];

    const travelTimeSequence = [train.departure_time];
    for (let i = 0; i < arrivals.length - 1; i++) {
      const departureTime = this.getTotalTravelTime([
        travelTimeSequence[i],
        arrivals[i].stop_time,
      ]);
      let arrivalTime = this.getTotalTravelTime([
        travelTimeSequence[i],
        arrivals[i + 1].travel_time,
        arrivals[i].stop_time,
      ]);
      travelTimeSequence.push(arrivalTime);
      schedulesSubRoutes.push({
        departureStation: arrivals[i].station_id,
        arrivalStation: arrivals[i + 1].station_id,
        departureTime,
        arrivalTime: travelTimeSequence[i + 1],
        stopTime: arrivals[i].stop_time,
      });
    }
    return schedulesSubRoutes;
  }

  getTotalTravelTime(times: string[]): string {
    let totalTime = 0;
    times.forEach((time) => {
      totalTime += this.convertTimeToMilliseconds(time);
    });

    return this.convertMillisecondsToFullTime(totalTime);
  }

  convertTimeToMilliseconds(time: string): number {
    const oneMinuteInMill = 60000;
    const oneHourInMill = 3600000;

    const timeArray = time.split(':').map(Number);
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

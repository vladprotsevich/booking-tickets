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

  async getSchedule(train_id: string) {
    const train = await this.trainsService.findOne(train_id);
    const arrivals = await this.arrivalsService.getArrivalsByRoute(
      train.route_id,
    );

    const schedulesSubRoutes: Schedule[] = [];

    let currentTime = train.departure_time;
    let nextTime = '';

    for (let i = 0; i < arrivals.length - 1; i++) {
      const departureTime = this.getTotalTravelTime([
        currentTime,
        arrivals[i].stop_time,
      ]);

      let arrivalTime = this.getTotalTravelTime([
        currentTime,
        arrivals[i + 1].travel_time,
        arrivals[i].stop_time,
      ]);

      nextTime = arrivalTime;

      const schedule = new Schedule();
      schedule.departureStation = arrivals[i].station_id;
      schedule.arrivalStation = arrivals[i + 1].station_id;
      schedule.departureTime = departureTime;
      schedule.arrivalTime = arrivalTime;
      schedule.stopTime = arrivals[i].stop_time;
      schedulesSubRoutes.push(schedule);

      currentTime = nextTime;
    }
    return schedulesSubRoutes;
  }

  getTotalTravelTime(times: string[]): string {
    let totalTime = 0;

    for (const time of times) {
      totalTime += this.convertTimeToMilliseconds(time);
    }

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
    const TIME_DIFF_HOURS = 3; 
    const hours = `0${Math.abs(new Date(millisec).getHours() - TIME_DIFF_HOURS)}`.slice(-2);
    const minutes = `0${new Date(millisec).getMinutes()}`.slice(-2);
    const seconds = `0${new Date(millisec).getSeconds()}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }
}

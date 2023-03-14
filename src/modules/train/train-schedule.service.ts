import { Injectable } from '@nestjs/common';
import { ArrivalService } from '../arrival/arrival.service';
import { Schedule } from './models/schedule.model';

@Injectable()
export class TrainScheduleService {
  constructor(private readonly arrivalsService: ArrivalService) {}

  async getSchedule(route_id: string, trainDepartureTime: string) {
    const arrivals = await this.arrivalsService.getArrivalsByRoute(route_id);
    const schedule: Schedule[] = [];

    let currentTime = this.convertTimeToMinutes(trainDepartureTime);

    for (let i = 0; i < arrivals.length - 1; i++) {
      const departureTime = this.getTotalTravelTime([
        currentTime,
        arrivals[i].stop_time,
      ]);

      const arrivalTime = this.getTotalTravelTime([
        currentTime,
        arrivals[i + 1].travel_time,
        arrivals[i].stop_time,
      ]);

      const subRoute = new Schedule();
      subRoute.departureStation = arrivals[i].station_id;
      subRoute.arrivalStation = arrivals[i + 1].station_id;
      subRoute.departureTime = departureTime;
      subRoute.arrivalTime = arrivalTime;
      schedule.push(subRoute);

      const nextTime = this.convertTimeToMinutes(arrivalTime);

      currentTime = nextTime;
    }
    return schedule;
  }

  convertTimeToMinutes(time: string) {
    const MINUTES_IN_HOUR = 60;
    const [timeHours, timeMinutes] = time.split(':').map(Number);
    return timeHours * MINUTES_IN_HOUR + timeMinutes;
  }

  getTotalTravelTime(minutesCollection: number[]) {
    const ONE_MIN_IN_MILL = 60 * 1000;
    let totalTimeOfMinutes = 0;
    for (const minute of minutesCollection) {
      totalTimeOfMinutes += minute;
    }
    totalTimeOfMinutes *= ONE_MIN_IN_MILL;
    return this.convertMillisecondsToFullTime(totalTimeOfMinutes);
  }

  convertMillisecondsToFullTime(millisec: number): string {
    const dateTime = new Date(new Date(0, 0).getTime() + millisec);
    const hours = `0${dateTime.getHours()}`.slice(-2);
    const minutes = `0${dateTime.getMinutes()}`.slice(-2);
    const seconds = `0${dateTime.getSeconds()}`.slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }
}

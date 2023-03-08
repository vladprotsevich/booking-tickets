import { Injectable } from '@nestjs/common';
import { ArrivalService } from '../arrival/arrivals.service';
import { Schedule } from './models/schedule.model';

@Injectable()
export class SchedulesService {
  constructor(private readonly arrivalsService: ArrivalService) {}

  async getSchedule(route_id: string, trainDepartureTime: string) {
    const arrivals = await this.arrivalsService.getArrivalsByRoute(route_id);
    const schedule: Schedule[] = [];

    let currentTime = trainDepartureTime;
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

      const subRoute = new Schedule();
      subRoute.arrivalStation = arrivals[i].station_id;
      subRoute.departureStation = arrivals[i + 1].station_id;
      subRoute.departureTime = departureTime;
      subRoute.arrivalTime = arrivalTime;
      schedule.push(subRoute);

      currentTime = nextTime;
    }
    return schedule;
  }

  getTotalTravelTime(times: string[]) {
    let totalTime = 0;
    for (const time of times) {
      totalTime += this.convertTimeToMilliseconds(time);
    }
    return this.convertMillisecondsToFullTime(totalTime);
  }

  convertTimeToMilliseconds(time: string) {
    const oneMinuteInMill = 60000;
    const oneHourInMill = 3600000;
    const timeArray = time.split(':').map(Number);
    const timeHours = timeArray[0];
    const timeMinutes = timeArray[1];
    const timeMilliseconds =
      timeHours * oneHourInMill + timeMinutes * oneMinuteInMill;
    return timeMilliseconds;
  }

  convertMillisecondsToFullTime(millisec: number): string {
    const dateTime = new Date(new Date(0, 0).getTime() + millisec);
    const hours = `0${dateTime.getHours()}`.slice(-2);
    const minutes = `0${dateTime.getMinutes()}`.slice(-2);
    const seconds = `0${dateTime.getSeconds()}`.slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }
}

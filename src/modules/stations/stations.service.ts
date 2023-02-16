import { Injectable } from '@nestjs/common';
import { sanitizeBody } from 'src/common/sanitize';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { DatabaseService } from '../database/database.service';
import { SchedulesService } from '../trains/schedule.service';
import { TrainsService } from '../trains/trains.service';
import { CreateStationDTO } from './dto/create.station.dto';
import { StationDTO } from './dto/station.dto';
import { StationScheduleDTO } from './dto/station.schedule.dto';

@Injectable()
export class StationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly scheduleService: SchedulesService,
    private readonly trainsService: TrainsService,
    private readonly arrivalsService: ArrivalsService,
  ) {}

  async allStations() {
    return this.databaseService.findAll('stations', ['*'], {});
  }

  async createStation(body: CreateStationDTO) {
    return this.databaseService.createObj('stations', body);
  }

  async updateStation(body: StationDTO) {
    return this.databaseService.updateObj('stations', { id: body.id }, body);
  }

  async getSchedule(station_uuid: string) {
    const trains = await this.trainsService.getTrains(station_uuid);
    const schedule = [];

    for (let i = 0; i < trains.length; i++) {
      const departureTime = trains[i].departure_time;
      const lastArrivalStationTime = await this.getArrivalStationTime(
        departureTime,
        trains[i].id,
        station_uuid,
        true,
        false,
      );
      const currentArrivalStationTime = await this.getArrivalStationTime(
        departureTime,
        trains[i].id,
        station_uuid,
        false,
        true,
      );
      const currentDepartureStationTime = await this.getArrivalStationTime(
        departureTime,
        trains[i].id,
        station_uuid,
        false,
        false,
      );
      let scheduleObject = {
        train_id: trains[i].id,
        startStationDeparture: departureTime,
        endStationArrival: lastArrivalStationTime,
        arrivalToCurrentStation: currentArrivalStationTime,
        departureFromCurrentStation: currentDepartureStationTime,
      };

      const sanitizedScheduleObj = await this.sanitizeSchedule(scheduleObject);
      schedule.push(sanitizedScheduleObj);
    }
    return schedule;
  }

  async getTravelCollectionTime(
    train_uuid: string,
    station_uuid: string,
    isLast: boolean,
  ) {
    const consistencyNumber =
      await this.arrivalsService.getConsistencyNumOfStation(
        train_uuid,
        station_uuid,
        isLast,
      );

    return this.arrivalsService.getArrivalTime(
      train_uuid,
      consistencyNumber.consistency_number,
    );
  }

  async getArrivalStationTime(
    departure_time: string,
    train_uuid: string,
    station_uuid: string,
    isLast: boolean,
    notCurrentStation: boolean,
  ) {
    const travelCollection = await this.getTravelCollectionTime(
      train_uuid,
      station_uuid,
      isLast,
    );

    const travelTime = travelCollection.map((arrivals) => arrivals.travel_time);
    const stopTime = notCurrentStation
      ? travelCollection.map((arrivals) => arrivals.stop_time)
      : travelCollection
          .filter((travel) => travel.station_id != station_uuid)
          .map((stop) => stop.stop_time);

    return this.scheduleService.getTravelTime([
      ...travelTime,
      ...stopTime,
      departure_time,
    ]);
  }

  async sanitizeSchedule(scheduleObject: StationScheduleDTO) {
    if (
      scheduleObject.endStationArrival ==
      scheduleObject.departureFromCurrentStation
    ) {
      scheduleObject.departureFromCurrentStation = null;
    } else if (
      scheduleObject.arrivalToCurrentStation ===
      scheduleObject.departureFromCurrentStation
    ) {
      scheduleObject.arrivalToCurrentStation = null;
    }

    return sanitizeBody(scheduleObject);
  }
}

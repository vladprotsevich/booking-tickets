import { Injectable } from '@nestjs/common';
import { sanitizeBody } from 'src/common/sanitize';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { DatabaseService } from '../database/database.service';
import { SchedulesService } from '../trains/schedule.service';
import { TrainsService } from '../trains/trains.service';
import { CreateStationDTO } from './dto/create.station.dto';
import { JourneyDTO } from './dto/journey.dto';
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
      const FirstDepartureStationTime = trains[i].departure_time;
      const lastStationArrivalTime = await this.getLastStationTime(
        FirstDepartureStationTime,
        trains[i].id,
        station_uuid,
      );
      const currentStationArrivalTime = await this.getCurrentStationTime(
        FirstDepartureStationTime,
        trains[i].id,
        station_uuid,
      );
      const currentDepartureStationTime =
        await this.getDepartureFromCurrentStationTime(
          FirstDepartureStationTime,
          trains[i].id,
          station_uuid,
        );
      const scheduleObject = {
        train_id: trains[i].id,
        startStationDeparture: FirstDepartureStationTime,
        endStationArrival: lastStationArrivalTime,
        arrivalToCurrentStation: currentStationArrivalTime,
        departureFromCurrentStation: currentDepartureStationTime,
      };

      const sanitizedScheduleObj = await this.sanitizeSchedule(scheduleObject);
      schedule.push(sanitizedScheduleObj);
    }
    return schedule;
  }

  async getLastStationTime(
    initialDepartureTime: string,
    train_uuid: string,
    station_uuid: string,
  ) {
    const lastArrivalOrder =
      await this.arrivalsService.getLastOrderNumberOfStation(
        train_uuid,
        station_uuid,
      );
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyTimeCollection(
        train_uuid,
        lastArrivalOrder,
      );
    return this.calculateArrivalTime(
      initialDepartureTime,
      journeyTimeCollection,
    );
  }

  async getCurrentStationTime(
    initialDepartureTime: string,
    train_uuid: string,
    station_uuid: string,
  ) {
    const currenArrivalOrder =
      await this.arrivalsService.getCurrentOrderNumberOfStation(
        train_uuid,
        station_uuid,
      );
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyTimeCollection(
        train_uuid,
        currenArrivalOrder,
      );
    journeyTimeCollection[journeyTimeCollection.length - 1].stop_time =
      '00:00:00';
    return this.calculateArrivalTime(
      initialDepartureTime,
      journeyTimeCollection,
    );
  }

  async getDepartureFromCurrentStationTime(
    initialDepartureTime: string,
    train_uuid: string,
    station_uuid: string,
  ) {
    const currenArrivalOrder =
      await this.arrivalsService.getCurrentOrderNumberOfStation(
        train_uuid,
        station_uuid,
      );

    const journeyTimeCollection =
      await this.arrivalsService.getJourneyTimeCollection(
        train_uuid,
        currenArrivalOrder,
      );
    return this.calculateArrivalTime(
      initialDepartureTime,
      journeyTimeCollection,
    );
  }

  async calculateArrivalTime(
    initialDepartureTime: string,
    journeyTimeCollection: JourneyDTO[],
  ) {
    const timeCollection = journeyTimeCollection
      .map((travel) => [travel.travel_time, travel.stop_time])
      .flat();
    return this.scheduleService.getTotalTravelTime([
      initialDepartureTime,
      ...timeCollection,
    ]);
  }

  async sanitizeSchedule(schedule: StationScheduleDTO) {
    if (schedule.departureFromCurrentStation === schedule.endStationArrival)
      schedule.departureFromCurrentStation = null;
    else if (
      schedule.startStationDeparture === schedule.departureFromCurrentStation
    )
      schedule.arrivalToCurrentStation = null;

    return sanitizeBody(schedule);
  }
}

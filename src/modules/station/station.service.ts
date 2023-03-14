import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { ArrivalService } from '../arrival/arrival.service';
import { TrainScheduleService } from '../train/train-schedule.service';
import { TrainService } from '../train/train.service';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { DepartureData } from './models/departure.model';
import { StationTrainSchedule } from './models/station-train-schedule.model';
import { Station } from './models/station.model';

@Injectable()
export class StationService {
  constructor(
    private readonly scheduleService: TrainScheduleService,
    private readonly trainService: TrainService,
    private readonly arrivalsService: ArrivalService,
  ) {}

  private qb() {
    return dbConf<Station>('stations');
  }

  async getAllStations() {
    return this.qb();
  }

  async createStation(body: CreateStationDTO) {
    try {
      const [station] = await this.qb().insert(body).returning('*');
      return station;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a station with invalid data',
      });
    }
  }

  async updateStation(id: string, body: UpdateStationDTO) {
    try {
      const affected = await this.qb().update(body).where({ id });
      return Boolean(affected);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot update the station with name that already exists',
      });
    }
  }

  async findStationsByRoute(route_id: string) {
    try {
      const routeStations: Station[] = await this.qb()
        .select('stations.*')
        .innerJoin('arrivals', 'arrivals.station_id', '=', 'stations.id')
        .where({ route_id })
        .orderBy('arrivals.order');
      return routeStations;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description: 'Cannot find nested stations for the route',
      });
    }
  }

  async getSchedule(station_id: string) {
    const trains = await this.trainService.getStationTrains(station_id);
    const schedule: StationTrainSchedule[] = [];
    for (const train of trains) {
      const args: DepartureData = {
        firstDepartureStationTime: train.departure_time,
        route_id: train.route_id,
        station_id,
      };
      const lastStationArrivalTime = await this.getLastStationTime(args);
      const currentStationArrivalTime = await this.getStationTime(
        args,
        'current_arrival',
      );
      const currentStationDepartureTime = await this.getStationTime(
        args,
        'current_departure',
      );

      const stationTrainSchedule = new StationTrainSchedule();

      stationTrainSchedule.train_id = train.id;
      stationTrainSchedule.startStationDepartureTime = train.departure_time;
      stationTrainSchedule.endStationArrivalTime = lastStationArrivalTime;
      stationTrainSchedule.arrivalToCurrentStationTime =
        currentStationArrivalTime;
      stationTrainSchedule.departureFromCurrentStationTime =
        currentStationDepartureTime;

      const sanitizeStationdScheduleObj = await this.sanitizeSchedule(
        stationTrainSchedule,
      );
      schedule.push(sanitizeStationdScheduleObj);
    }
    return schedule;
  }

  async getLastStationTime(args: DepartureData) {
    const lastArrivalOrder = await this.arrivalsService.getLastStationOrder(
      args.route_id,
    );
    return this.buildStationTime(lastArrivalOrder, args, true);
  }

  async getStationTime(
    args: DepartureData,
    type: 'current_arrival' | 'current_departure',
  ) {
    const currenArrivalOrder =
      await this.arrivalsService.getCurrentStationOrder(
        args.route_id,
        args.station_id,
      );
    const stationType = type === 'current_arrival' ? true : false;
    return this.buildStationTime(currenArrivalOrder, args, stationType);
  }

  async buildStationTime(
    order: number,
    args: DepartureData,
    removeLastStopTime: boolean,
  ) {
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyCollectionByRoute(
        args.route_id,
        order,
      );

    if (removeLastStopTime)
      journeyTimeCollection[journeyTimeCollection.length - 1].stop_time = 0;

    const { firstDepartureTime, timeCollection } =
      await this.trainService.collectTrainArrivalTime(
        args.firstDepartureStationTime,
        journeyTimeCollection,
      );
    return this.scheduleService.getTotalTravelTime([
      firstDepartureTime,
      ...timeCollection,
    ]);
  }

  async sanitizeSchedule(schedule: StationTrainSchedule) {
    if (
      schedule.departureFromCurrentStationTime ===
      schedule.endStationArrivalTime
    )
      delete schedule.departureFromCurrentStationTime;
    if (
      schedule.startStationDepartureTime ===
      schedule.departureFromCurrentStationTime
    )
      delete schedule.arrivalToCurrentStationTime;

    return schedule;
  }
}

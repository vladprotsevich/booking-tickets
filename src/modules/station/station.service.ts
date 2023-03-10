import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { ArrivalService } from '../arrival/arrivals.service';
import { SchedulesService } from '../train/schedule.service';
import { TrainService } from '../train/train.service';
import { CreateStationDTO } from './dto/create-station.dto';
import { Journey } from './models/journey.model';
import { UpdateStationDTO } from './dto/update-station.dto';
import { DepartureObj } from './models/departure.model';
import { StationTrainSchedule } from './models/station-train-schedule.model';
import { Station } from './models/station.model';

@Injectable()
export class StationService {
  constructor(
    private readonly scheduleService: SchedulesService,
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

  async updateStation(id: string, body: UpdateStationDTO): Promise<boolean> {
    try {
      const station = await this.qb().update(body).where({ id });
      return Boolean(station);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot update the station with invalid data',
      });
    }
  }

  async findStationsByRoute(route_id: string): Promise<Station[]> {
    try {
      const routeStations = await this.qb()
        .innerJoin('arrivals', 'arrivals.station_id', '=', 'stations.id')
        .where({ route_id })
        .select('stations.id', 'stations.name', 'arrivals.order');
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
    for (let i = 0; i < trains.length; i++) {
      const train = trains[i];
      const args: DepartureObj = {
        firstDepartureStationTime: train.departure_time,
        route_id: train.route_id,
        station_id,
      };
      const lastStationArrivalTime = await this.getLastStationTime(args);
      const currentStationArrivalTime = await this.getCurrentStationTime(args);
      const currentDepartureStationTime =
        await this.getDepartureFromCurrentStationTime(args);

      const stationTrainSchedule = new StationTrainSchedule();

      stationTrainSchedule.train_id = train.id;
      stationTrainSchedule.startStationDeparture = train.departure_time;
      stationTrainSchedule.endStationArrival = lastStationArrivalTime;
      stationTrainSchedule.arrivalToCurrentStation = currentStationArrivalTime;
      stationTrainSchedule.departureFromCurrentStation =
        currentDepartureStationTime;

      const sanitizeStationdScheduleObj = await this.sanitizeSchedule(
        stationTrainSchedule,
      );
      schedule.push(sanitizeStationdScheduleObj);
    }
    return schedule;
  }

  async getLastStationTime(args: DepartureObj) {
    const lastArrivalOrder = await this.arrivalsService.getLastStationOrder(
      args.route_id,
    );
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyCollectionByRoute(
        args.route_id,
        lastArrivalOrder,
      );
    return this.calculateArrivalTime(
      args.firstDepartureStationTime,
      journeyTimeCollection,
    );
  }

  async getCurrentStationTime(args: DepartureObj) {
    const currenArrivalOrder =
      await this.arrivalsService.getCurrentStationOrder(
        args.route_id,
        args.station_id,
      );
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyCollectionByRoute(
        args.route_id,
        currenArrivalOrder,
      );
    journeyTimeCollection[journeyTimeCollection.length - 1].stop_time =
      '00:00:00';
    return this.calculateArrivalTime(
      args.firstDepartureStationTime,
      journeyTimeCollection,
    );
  }

  async getDepartureFromCurrentStationTime(args: DepartureObj) {
    const currenArrivalOrder =
      await this.arrivalsService.getCurrentStationOrder(
        args.route_id,
        args.station_id,
      );
    const journeyTimeCollection =
      await this.arrivalsService.getJourneyCollectionByRoute(
        args.route_id,
        currenArrivalOrder,
      );
    return this.calculateArrivalTime(
      args.firstDepartureStationTime,
      journeyTimeCollection,
    );
  }

  async calculateArrivalTime(
    initialDepartureTime: string,
    journeyTimeCollection: Journey[],
  ) {
    const timeCollection = journeyTimeCollection
      .map((travel) => [travel.travel_time, travel.stop_time])
      .flat();
    return this.scheduleService.getTotalTravelTime([
      initialDepartureTime,
      ...timeCollection,
    ]);
  }

  async sanitizeSchedule(schedule: StationTrainSchedule) {
    if (schedule.departureFromCurrentStation === schedule.endStationArrival)
      delete schedule.departureFromCurrentStation;
    if (schedule.startStationDeparture === schedule.departureFromCurrentStation)
      delete schedule.arrivalToCurrentStation;

    return schedule;
  }
}

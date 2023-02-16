import { IsUUID } from 'class-validator';

export class StationScheduleDTO {
  @IsUUID('4')
  train_id: string;

  startStationDeparture: string;

  endStationArrival: string;

  arrivalToCurrentStation: string;

  departureFromCurrentStation: string;
}

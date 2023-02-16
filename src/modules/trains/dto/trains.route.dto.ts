import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class TrainRouteDTO {
  @ValidateIf(
    (x) => x.departure_station || x.arrival_station || x.departure_time,
  )
  @IsNotEmpty()
  departure_station: string;

  @ValidateIf(
    (x) => x.departure_station || x.arrival_station || x.departure_time,
  )
  @IsNotEmpty()
  arrival_station: string;

  @ValidateIf(
    (x) => x.departure_station || x.arrival_station || x.departure_time,
  )
  @IsNotEmpty()
  departure_time: string;
}

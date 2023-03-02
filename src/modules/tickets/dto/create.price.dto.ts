import { IsEnum, IsNotEmpty } from 'class-validator';
import { Carriages } from 'src/common/enums/carriages.enum';
import { Trains } from 'src/common/enums/trains.enum';

export class CreatePriceDTO {
  @IsNotEmpty()
  ticket_id: string;

  @IsNotEmpty()
  departure_station: string;

  @IsNotEmpty()
  arrival_station: string;

  @IsNotEmpty()
  @IsEnum(Trains)
  train_type: string;

  @IsNotEmpty()
  @IsEnum(Carriages)
  carriage_type: string;
}

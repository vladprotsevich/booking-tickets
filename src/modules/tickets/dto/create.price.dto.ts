import { IsEnum, IsNotEmpty } from 'class-validator';
import { CarriageType } from 'src/common/enums/carriage.type.enum';
import { TrainType } from 'src/common/enums/train.type.enum';

export class CreatePriceDTO {
  @IsNotEmpty()
  ticket_id: string;

  @IsNotEmpty()
  departure_station: string;

  @IsNotEmpty()
  arrival_station: string;

  @IsNotEmpty()
  @IsEnum(TrainType)
  train_type: string;

  @IsNotEmpty()
  @IsEnum(CarriageType)
  carriage_type: string;
}

import { IsEnum, IsNotEmpty } from 'class-validator';
import { CarriageEnum } from 'src/common/enums/carriage.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export class CreatePriceDTO {
  @IsNotEmpty()
  public ticket_id: string;

  @IsNotEmpty()
  public departure_station: string;

  @IsNotEmpty()
  public arrival_station: string;

  @IsNotEmpty()
  @IsEnum(TrainEnum)
  public train_type: TrainEnum;

  @IsNotEmpty()
  @IsEnum(CarriageEnum)
  public carriage_type: CarriageEnum;

  @IsNotEmpty()
  public price: number;
}

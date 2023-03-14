import { CarriageEnum } from 'src/common/enums/carriage.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export class CreatePriceData {
  public ticket_id: string;

  public departure_station: string;

  public arrival_station: string;

  public train_type: TrainEnum;

  public carriage_type: CarriageEnum;

  public price: number;
}

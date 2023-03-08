import { CarriageEnum } from 'src/common/enums/carriage.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export class Price {
  id: string;

  ticket_id: string;

  departure_station: string;

  arrival_station: string;

  train_type: TrainEnum;

  carriage_type: CarriageEnum;

  price: number;
}

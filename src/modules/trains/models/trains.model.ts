import { TrainType } from 'src/common/enums/train.type.enum';
import { Frequencies } from './frequency.model';

export class Trains {
  id: string;

  number: number;

  machinist_id: string;

  driver_assistant_id: string;

  head_of_train_id: string;

  route_id: string;

  departure_time: string;

  train_type: TrainType;

  frequencies?: Frequencies[];
}

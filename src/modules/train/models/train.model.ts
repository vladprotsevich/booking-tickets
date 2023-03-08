import { FrequencyEnum } from 'src/common/enums/frequency.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export class Train {
  id: string;

  number: number;

  machinist_id: string;

  driver_assistant_id: string;

  head_of_train_id: string;

  route_id: string;

  departure_time: string;

  train_type: TrainEnum;

  frequencies: FrequencyEnum[];
}

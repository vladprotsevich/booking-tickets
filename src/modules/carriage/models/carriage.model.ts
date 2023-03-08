import { CarriageEnum } from 'src/common/enums/carriage.enum';

export class Carriage {
  id: string;

  train_id: string;

  carriage_number: number;

  first_conductor_id: string;

  second_conductor_id: string;

  carriage_type: CarriageEnum;
}

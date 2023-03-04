import { CarriageType } from 'src/common/enums/carriage.type.enum';

export class CarriageDTO {
  id: string;

  number: number;

  train_id: string;

  first_conductor_id: string;

  carriage_type: CarriageType;

  second_conductor_id: string;
}

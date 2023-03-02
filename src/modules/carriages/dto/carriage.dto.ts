import { Carriages } from 'src/common/enums/carriages.enum';

export class CarriageDTO {
  id: string;

  number: number;

  train_id: string;

  first_conductor_id: string;

  carriage_type: Carriages;

  second_conductor_id: string;
}

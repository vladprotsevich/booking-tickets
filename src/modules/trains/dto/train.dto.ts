export class TrainDTO {
  id: number | string;

  number: number;

  machinist_id: string | number;

  driver_assistant_id: string | number;

  head_of_train_id: string | number;

  route_id: string | number;

  schedule_id: string | number;

  departure_time: string;

  type: string;

  frequency: object | [];

  frequency_type: string;

  train_type: string;
}

import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Carriages } from 'src/common/enums/carriages.enum';

export class CreateCarriageDTO {
  @IsNotEmpty()
  carriage_number: string;

  @IsNotEmpty()
  @IsUUID('4')
  train_id: string;

  @IsNotEmpty()
  @IsUUID('4')
  first_conductor_id: string;

  @IsEnum(Carriages)
  @IsNotEmpty()
  carriage_type: Carriages;

  @IsNotEmpty()
  @IsUUID('4')
  second_conductor_id: string;
}

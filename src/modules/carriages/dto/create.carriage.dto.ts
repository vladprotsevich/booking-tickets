import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { CarriageType } from 'src/common/enums/carriage.type.enum';

export class CreateCarriageDTO {
  @IsNotEmpty()
  carriage_number: string;

  @IsNotEmpty()
  @IsUUID('4')
  train_id: string;

  @IsNotEmpty()
  @IsUUID('4')
  first_conductor_id: string;

  @IsEnum(CarriageType)
  @IsNotEmpty()
  carriage_type: CarriageType;

  @IsNotEmpty()
  @IsUUID('4')
  second_conductor_id: string;
}

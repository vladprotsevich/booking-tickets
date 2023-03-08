import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSeatDTO {
  @IsNotEmpty()
  @Type(() => Number)
  number: number;

  @IsNotEmpty()
  @IsUUID('4')
  carriage_id: string;
}

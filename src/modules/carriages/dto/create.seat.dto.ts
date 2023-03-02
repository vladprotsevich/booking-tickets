import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSeatDTO {
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  @IsUUID('4')
  carriage_id: string;
}

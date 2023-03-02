import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TicketStatus } from 'src/common/enums/states.enum';

export class BuyTicketDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  document_type: string;

  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(30)
  document_number: string;

  @IsNotEmpty()
  departure_date: string;

  @IsNotEmpty()
  train_id: string;

  @IsNotEmpty()
  carriage_id: string;

  @IsNotEmpty()
  seat_id: string;

  @IsNotEmpty()
  departure_station: string;

  @IsNotEmpty()
  arrival_station: string;

  @IsOptional()
  status: TicketStatus;

  @IsOptional()
  @IsUUID('4')
  user_id: string;
}

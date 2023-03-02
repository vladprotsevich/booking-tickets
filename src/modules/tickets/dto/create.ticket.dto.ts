import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TicketStatus } from 'src/common/enums/states.enum';

export class CreateTicketDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  documentType: string;

  @IsNotEmpty()
  documentNumber: string;

  @IsNotEmpty()
  @IsUUID('4')
  train_id: string;

  @IsNotEmpty()
  @IsUUID('4')
  carriage_id: string;

  @IsNotEmpty()
  @IsUUID('4')
  seat_id: string;

  @IsNotEmpty()
  departure_time: string;

  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}

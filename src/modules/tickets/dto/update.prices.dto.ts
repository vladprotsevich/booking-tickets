import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Trains } from 'src/common/enums/trains.enum';

export class UpdatePricesDTO {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsOptional()
  @IsUUID('4')
  ticket_id: string;
}

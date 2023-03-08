import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdatePriceDTO {
  @IsOptional()
  @IsUUID('4')
  ticket_id: string;
}

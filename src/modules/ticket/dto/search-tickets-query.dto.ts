import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';

export class SearchTicketsQueryDTO {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEnum(TicketStatusEnum)
  readonly type: TicketStatusEnum;
}

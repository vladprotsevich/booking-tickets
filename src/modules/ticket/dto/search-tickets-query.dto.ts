import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';

export class SearchTicketsQueryDTO {
  @ApiProperty({ enum: TicketStatusEnum })
  @IsNotEmpty()
  @IsEnum(TicketStatusEnum)
  readonly type: TicketStatusEnum;
}

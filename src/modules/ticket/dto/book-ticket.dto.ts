import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentEnum } from 'src/common/enums/document.enum';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';

export class BookTicketDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty()
  @IsEnum(DocumentEnum)
  @IsNotEmpty()
  readonly document_type: DocumentEnum;

  @ApiProperty()
  @IsNotEmpty()
  readonly document_number: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly departure_date: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly train_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly carriage_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly seat_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly departure_station: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly arrival_station: string;

  public user_id?: string;

  public status?: TicketStatusEnum;
}

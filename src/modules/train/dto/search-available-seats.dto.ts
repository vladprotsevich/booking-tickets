import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SearchTrainSeatsQueryDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly departureStation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly arrivalStation: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly departureDate: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID('4')
  public train_id?: string;
}

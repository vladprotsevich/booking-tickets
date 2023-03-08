import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateArrivalDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly route_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly station_id: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly travel_time: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly stop_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  readonly order: number;
}

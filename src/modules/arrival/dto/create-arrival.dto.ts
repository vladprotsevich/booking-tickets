import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

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
  @Type(() => Number)
  readonly travel_time: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  readonly stop_time: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  readonly order: number;
}

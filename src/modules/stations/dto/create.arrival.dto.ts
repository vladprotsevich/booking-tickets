import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateArrivalDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  route_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  station_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  travel_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  stop_time: string;

  @IsNotEmpty()
  consistency_number: number;
}

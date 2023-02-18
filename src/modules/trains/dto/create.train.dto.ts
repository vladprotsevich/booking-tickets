import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Frequencies } from 'src/common/enums/frequency.enum';
import { Trains } from 'src/common/enums/trains.enum';

export class CreateTrainDTO {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  route_id: string;

  @IsNotEmpty()
  @IsString()
  departure_time: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  machinist_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  driver_assistant_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  head_of_train_id: string;

  @ApiProperty({ enum: Trains })
  @IsEnum(Trains)
  train_type: Trains;

  @ApiProperty({ enum: Frequencies })
  @IsEnum(Frequencies, { each: true })
  frequency: Frequencies[];
}

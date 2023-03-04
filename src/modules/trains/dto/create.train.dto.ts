import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { FrequencyType } from 'src/common/enums/frequency.enum';
import { TrainType } from 'src/common/enums/train.type.enum';
import { Frequencies } from '../models/frequency.model';

export class CreateTrainDTO {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  route_id: string;

  @ApiProperty()
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

  @ApiProperty({ enum: TrainType })
  @IsEnum(TrainType)
  train_type: TrainType;

  @ApiProperty({ enum: FrequencyType, type: [Frequencies] })
  @IsEnum(FrequencyType, { each: true })
  frequencies?: FrequencyType[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { FrequencyEnum } from 'src/common/enums/frequency.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export class CreateTrainDTO {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly route_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly departure_time: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly machinist_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly driver_assistant_id: string;

  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly head_of_train_id: string;

  @ApiProperty({ enum: TrainEnum })
  @IsEnum(TrainEnum)
  readonly train_type: TrainEnum;

  @ApiProperty({ enum: FrequencyEnum })
  @IsEnum(FrequencyEnum, { each: true })
  readonly frequencies?: FrequencyEnum[];
}

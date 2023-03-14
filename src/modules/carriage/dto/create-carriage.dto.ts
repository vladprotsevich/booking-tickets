import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { CarriageEnum } from 'src/common/enums/carriage.enum';

export class CreateCarriageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  readonly carriage_number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly train_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly first_conductor_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  readonly second_conductor_id: string;

  @ApiProperty({ enum: CarriageEnum })
  @IsEnum(CarriageEnum)
  @IsNotEmpty()
  readonly carriage_type: CarriageEnum;
}

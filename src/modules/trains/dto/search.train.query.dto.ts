import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class SearchTrainQueryDTO { // TODO: split into 2 different interfaces
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
  @IsUUID('4')
  readonly departureDate: string;

  @ApiProperty()
  @ValidateIf((x) => x.departureStation && x.arrivalStation && x.departureDate)
  @IsOptional()
  @IsUUID('4')
  readonly train_id?: string;
}

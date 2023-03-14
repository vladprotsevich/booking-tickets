import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SearchAvailableTrainsQueryDTO {
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

  public train_id?: string;
}

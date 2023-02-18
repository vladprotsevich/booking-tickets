import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStationDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

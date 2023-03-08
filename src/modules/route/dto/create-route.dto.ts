import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRouteDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

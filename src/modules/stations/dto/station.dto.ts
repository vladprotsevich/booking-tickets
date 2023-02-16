import { ApiProperty } from '@nestjs/swagger';

export class StationDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

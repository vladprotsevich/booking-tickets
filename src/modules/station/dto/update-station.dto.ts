import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateStationDTO {
  @ApiPropertyOptional()
  name: string;
}

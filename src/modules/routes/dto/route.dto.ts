import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StationDTO } from 'src/modules/stations/dto/station.dto';

export class RouteDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: [StationDTO] })
  stations?: string[];
}

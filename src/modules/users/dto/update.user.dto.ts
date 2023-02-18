import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateUserDTO {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  token?: string;
}

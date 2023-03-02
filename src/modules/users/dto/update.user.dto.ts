import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  id?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  surname?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  token?: string;

  @ApiPropertyOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  banned?: boolean;
}

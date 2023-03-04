import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';
export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  readonly id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly surname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly token?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Roles)
  readonly role?: Roles;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly banned?: boolean;
}

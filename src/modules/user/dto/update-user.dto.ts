import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';
export class UpdateUserDTO {
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
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly banned?: boolean;
}

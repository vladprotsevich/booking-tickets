import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';

export class ChangeRoleDTO {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  readonly role: Roles;
}

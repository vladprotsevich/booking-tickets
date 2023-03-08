import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';

export class ChangeRoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  readonly role: RoleEnum;
}

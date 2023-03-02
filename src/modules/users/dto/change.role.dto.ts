import { IsBoolean, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';

export class changeRole {
  @IsUUID('4')
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsBoolean()
  banned: boolean;
}

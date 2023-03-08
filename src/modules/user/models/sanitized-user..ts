import { RoleEnum } from 'src/common/enums/role.enum';

export class SanitizedUser {
  id: string;

  name: string;

  surname: string;

  email: string;

  role: RoleEnum;
}

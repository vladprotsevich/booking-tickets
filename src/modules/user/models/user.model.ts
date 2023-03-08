import { RoleEnum } from 'src/common/enums/role.enum';

export class User {
  id: string;

  name: string;

  surname: string;

  email: string;

  password: string;

  token: string;

  role: RoleEnum;

  banned: boolean;
}

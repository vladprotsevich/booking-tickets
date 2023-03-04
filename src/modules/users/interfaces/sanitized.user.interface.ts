import { Roles } from 'src/common/enums/roles.enum';

export class SanitizedUser {
  id: string;

  name: string;

  surname: string;

  email: string;

  role: Roles;
}

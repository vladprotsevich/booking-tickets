import { Roles } from 'src/common/enums/roles.enum';

export interface SanitizedUser {
  id: string;

  name: string;

  surname: string;

  email: string;

  role: Roles;
}

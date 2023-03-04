import { Roles } from "../../../common/enums/roles.enum";

export class User {
  id: string;

  name: string;

  surname: string;

  email: string;

  password: string;

  token: string;

  role: Roles;

  banned: boolean;
}

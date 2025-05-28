import { Roles } from "../enums/roles.enum";

 export interface IRegister {
  username: string;
  email: string;
  password: string;
  role: Roles;
}


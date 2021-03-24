import { Role } from '@models/role.model';

export class Account {
  id: string;
  title: string;
  username: string;
  email: string;
  role: Role;
  jwtToken?: string;
}

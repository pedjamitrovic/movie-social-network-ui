import { SystemEntityVM } from './system-entity-vm.model';

export class UserVM extends SystemEntityVM {
  role: string;
  username: string;
  email: string;
}

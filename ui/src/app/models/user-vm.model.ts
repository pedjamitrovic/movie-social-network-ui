import { SystemEntityVM } from './system-entity-vm.model';

export interface UserVM extends SystemEntityVM {
  role?: string;
  username?: string;
  email?: string;
}

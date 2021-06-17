import { SystemEntityVM } from './system-entity-vm.model';

export interface UserVM extends SystemEntityVM {
  username?: string;
  email?: string;
}

import { SystemEntityVM } from './system-entity-vm.model';

export interface NotificationVM {
  id?: number;
  type?: string;
  createdOn?: string;
  seen?: boolean;
  extended?: any;
  sender?: SystemEntityVM;
  routerLink?: string[];
  fromNow?: string;
}

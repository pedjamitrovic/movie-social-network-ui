import { SystemEntityVM } from './system-entity-vm.model';

export interface ContentVM {
  id?: number;
  text?: string;
  createdOn?: string;
  creator?: SystemEntityVM;
  reactionsCount?: Map<number, number>;
}

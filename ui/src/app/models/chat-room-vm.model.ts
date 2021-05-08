import { MessageVM } from './message-vm.model';
import { SystemEntityVM } from './system-entity-vm.model';

export interface ChatRoomVM {
  id?: number;
  members?: SystemEntityVM[];
  newestMessage?: MessageVM;
}

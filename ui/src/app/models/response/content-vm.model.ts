import { ReactionStats } from './reaction-stats.model';
import { ReactionVM } from './reaction-vm.model';
import { SystemEntityVM } from './system-entity-vm.model';

export interface ContentVM {
  id?: number;
  text?: string;
  createdOn?: string;
  creator?: SystemEntityVM;
  existingReaction?: ReactionVM;
  reactionStats?: ReactionStats[];
}

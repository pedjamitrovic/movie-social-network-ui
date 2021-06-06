import { ReactionType } from './reaction-type.model';

export interface CreateReactionCommand {
  value?: ReactionType;
}

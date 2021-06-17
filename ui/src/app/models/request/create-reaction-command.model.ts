import { ReactionType } from '../internal/reaction-type.model';

export interface CreateReactionCommand {
  value?: ReactionType;
}

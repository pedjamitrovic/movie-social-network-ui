import { Reaction } from './reaction.model';
import { User } from './user.model';

export class Comment {
  id?: string;
  user?: User;
  text?: string;
  createdOn?: Date;
  reactions?: Reaction[];
  comments?: Comment[];
}

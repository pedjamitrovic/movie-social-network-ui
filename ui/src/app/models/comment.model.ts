import { Reaction } from './reaction.model';
import { User } from './user.model';

export class Comment {
  id?: string;
  user?: User;
  text?: string;
  datePosted?: Date;
  reactions?: Reaction[];
  comments?: Comment[];
}

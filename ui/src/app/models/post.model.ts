import { Reaction } from './reaction.model';
import { User } from './user.model';
import { Comment } from './comment.model';

export class Post {
  id?: string;
  user?: User;
  createdOn?: Date;
  text?: string;
  reactions?: Reaction[];
  comments?: Comment[];
}

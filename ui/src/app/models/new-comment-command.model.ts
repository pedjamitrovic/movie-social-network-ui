import { User } from './user.model';

export interface NewCommentCommand {
  text?: string;
  user?: User;
}

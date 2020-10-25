import { User } from './user.model';

export class Post {
  id: string;
  user: User;
  datePosted: string;
  text: string;
}

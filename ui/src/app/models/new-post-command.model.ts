import { User } from './user.model';

export class NewPostCommand {
  text?: string;
  media?: File[];
  friends?: User[];

  constructor() {
    this.text = '';
    this.media = [];
    this.friends = [];
  }
}

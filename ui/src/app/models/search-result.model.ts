import { Post } from './post.model';
import { User } from './user.model';
import { Group } from './group.model';
import { Comment } from './comment.model';

export interface SearchResult {
  kind?: SearchResult.KindEnum;
  result: User | Group | Post | Comment;
}

// tslint:disable-next-line: no-namespace
export namespace SearchResult {
  export type KindEnum = 'user' | 'group' | 'post' | 'comment';
  export const KindEnum = {
    User: 'user' as KindEnum,
    Group: 'group' as KindEnum,
    Post: 'post' as KindEnum,
    Comment: 'comment' as KindEnum
  };
}

import { ContentVM } from './content-vm.model';

export interface CommentVM extends ContentVM {
  postId: number;
}

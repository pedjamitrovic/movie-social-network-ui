import { Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { Observable, of } from 'rxjs';
import { GroupService } from '@services/group/group.service';
import { CommentService } from '@services/comment/comment.service';
import { PostService } from '@services/post/post.service';
import { UserService } from '@services/user/user.service';
import { SearchResult } from '@models/search-result.model';
import { Group } from '@models/group.model';
import { Post } from '@models/post.model';
import { Comment } from '@models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchItems: SearchResult[];
  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private postService: PostService,
    private commentService: CommentService,
  ) {
    this.searchItems = [];
    for (let i = 0; i < 100; i++) {
      const item: SearchResult = {
        kind: SearchResult.KindEnum.User,
        result: this.userService.generateUser()
      };
      this.searchItems.push(item);
    }
    for (let i = 0; i < 100; i++) {
      const item: SearchResult = {
        kind: SearchResult.KindEnum.Group,
        result: this.groupService.generateGroup()
      };
      this.searchItems.push(item);
    }
    for (let i = 0; i < 100; i++) {
      const item: SearchResult = {
        kind: SearchResult.KindEnum.Post,
        result: this.postService.generatePost()
      };
      this.searchItems.push(item);
    }
    for (let i = 0; i < 100; i++) {
      const item: SearchResult = {
        kind: SearchResult.KindEnum.Comment,
        result: this.commentService.generateComment()
      };
      this.searchItems.push(item);
    }
  }

  search(q: string, kinds: SearchResult.KindEnum[]): Observable<SearchResult[]> {
    let searchResults = [];

    searchResults = this.searchItems.filter(
      (e) => {
        if (!kinds.includes(e.kind)) return false;
        switch (e.kind) {
          case SearchResult.KindEnum.User:
            const user = e.result as User;
            return user.username.toLowerCase().includes(q.toLowerCase()) ||
              user.description.toLowerCase().includes(q.toLowerCase());
          case SearchResult.KindEnum.Group:
            const group = e.result as Group;
            return group.title.toLowerCase().includes(q.toLowerCase()) ||
              group.subtitle.toLowerCase().includes(q.toLowerCase()) ||
              group.description.toLowerCase().includes(q.toLowerCase());
          case SearchResult.KindEnum.Post:
            const post = e.result as Post;
            return post.text.toLowerCase().includes(q.toLowerCase());
          case SearchResult.KindEnum.Comment:
            const comment = e.result as Comment;
            return comment.text.toLowerCase().includes(q.toLowerCase());
        }
      }
    );

    return of(searchResults);
  }
}

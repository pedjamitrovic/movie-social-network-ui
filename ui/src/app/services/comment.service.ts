import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostCommand } from '@models/create-post-command.model';
import { PostVM } from '@models/post-vm.model';
import { EnvironmentService } from './environment.service';
import { Observable, of } from 'rxjs';
import { Comment } from '@models/comment.model';
import { Chance } from 'chance';
import { UserService } from '@services/user/user.service';
import { CreateCommentCommand } from '@models/create-comment-command';
import { CommentVM } from '@models/comment-vm.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  chance = new Chance();
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/comments`;
  }

  getById(id: number) {
    return this.http.get<CommentVM>(`${this.apiUrl}/${id}`);
  }

  create(command: CreateCommentCommand) {
    return this.http.post<CommentVM>(`${this.apiUrl}`, command);
  }

  getComments(): Observable<Comment[]> {
    const comments: Comment[] = [];

    for (let i = 0; i < 10; ++i) {
      comments.push(this.generateComment());
    }

    return of(comments);
  }

  generateComment(): Comment {
    const comment: Comment = {
      id: this.chance.guid(),
      postId: this.chance.guid(),
      text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
      createdOn: this.chance.date({ min: new Date(), max: new Date() }) as Date,
      reactions: [],
      user: this.userService.generateUser(),
    };

    return comment;
  }
}

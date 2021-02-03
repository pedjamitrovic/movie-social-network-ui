import { Injectable } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { Chance } from 'chance';
import { Observable, of } from 'rxjs';
import { Comment } from '@models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  chance = new Chance();

  constructor(
    private userService: UserService
  ) {
    this.chance = new Chance();
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
      text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
      createdOn: this.chance.date({ min: new Date(), max: new Date() }) as Date,
      reactions: [],
      user: this.userService.generateUser(),
    };

    return comment;
  }
}

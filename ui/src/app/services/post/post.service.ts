import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '@models/post.model';
import { Chance } from 'chance';
import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  chance = new Chance();

  constructor(
    private userService: UserService
  ) {
    this.chance = new Chance();
  }

  getPosts(): Observable<Post[]> {
    const posts: Post[] = [];

    for (let i = 0; i < 10; ++i) {
      posts.push(this.generatePost());

      let natural = this.chance.natural({ min: 1, max: 10 });

      for (let j = 0; j < natural; ++j) {
        posts[i].comments.push({
          id: this.chance.guid(),
          text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
          createdOn: this.chance.date({ min: posts[i].createdOn, max: new Date() }) as Date,
          reactions: [],
          comments: [],
          user: this.userService.generateUser()
        });
      }

      natural = this.chance.natural({ min: 1, max: 100 });

      for (let j = 0; j < natural; ++j) {
        posts[i].reactions.push({
          id: this.chance.guid(),
          value: this.chance.natural({ min: 1, max: 1 }),
        });
      }
    }

    return of(posts);
  }

  generatePost(): Post {
    const post: Post = {
      id: this.chance.guid(),
      text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
      createdOn: this.chance.date({ max: new Date() }) as Date,
      reactions: [],
      comments: [],
      user: this.userService.generateUser()
    };

    return post;
  }
}

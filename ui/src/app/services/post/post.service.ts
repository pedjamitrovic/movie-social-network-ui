import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '@models/post.model';
import { Chance } from 'chance';
import { UserService } from '@services/user/user.service';
import { delay } from 'rxjs/operators';

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
    const o = new Observable<Post[]>(
      (s) => {
        const posts: Post[] = [];

        for (let i = 0; i < 10; ++i) {
          posts.push({
            id: this.chance.guid(),
            text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
            datePosted: new Date(this.chance.timestamp()),
            reactions: [],
            comments: [],
            user: {
              id: this.chance.guid(),
              firstName: this.chance.first(),
              lastName: this.chance.last()
            }
          });

          let natural = this.chance.natural({ min: 1, max: 10 });

          for (let j = 0; j < natural; ++j) {
            posts[i].comments.push({
              id: this.chance.guid(),
              text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
              datePosted: new Date(this.chance.timestamp()),
              reactions: [],
              comments: [],
              user: {
                id: this.chance.guid(),
                firstName: this.chance.first(),
                lastName: this.chance.last()
              }
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

        s.next(posts);
        s.complete();
      }
    );

    return o.pipe(delay(1000));
  }
}

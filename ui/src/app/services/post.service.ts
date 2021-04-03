import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePostCommand } from '@models/create-post-command.model';
import { PostVM } from '@models/post-vm.model';
import { EnvironmentService } from './environment.service';
import { Observable, of } from 'rxjs';
import { Post } from '@models/post.model';
import { Chance } from 'chance';
import { UserService } from '@services/user/user.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  chance = new Chance();
  apiUrl: string;

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.apiUrl = `${this.environment.apiUrl}/posts`;
  }

  getById(id: number) {
    return this.http.get<PostVM>(`${this.apiUrl}/${id}`);
  }

  create(command: CreatePostCommand) {
    return this.http.post<PostVM>(`${this.apiUrl}`, command);
  }

  getPosts(): Observable<Post[]> {
    const posts: Post[] = [];

    for (let i = 0; i < 10; ++i) {
      posts.push(this.generatePost());
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
      user: this.userService.generateUser(),
      friends: [],
    };

    let natural = this.chance.natural({ min: 1, max: 10 });

    for (let i = 0; i < natural; ++i) {
      post.comments.push({
        id: this.chance.guid(),
        text: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
        createdOn: this.chance.date({ min: post.createdOn, max: new Date() }) as Date,
        reactions: [],
        user: this.userService.generateUser()
      });
    }

    natural = this.chance.natural({ min: 1, max: 100 });

    for (let i = 0; i < natural; ++i) {
      post.reactions.push({
        id: this.chance.guid(),
        value: this.chance.natural({ min: 1, max: 1 }),
      });
    }

    return post;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '@models/post.model';

declare var Chance: any; // for externals librairies

@Injectable({
  providedIn: 'root'
})
export class PostService {
  chance: any;

  constructor() {
    this.chance  = new Chance();
  }

  getPosts(): Observable<Post[]> {
    const posts = [];

    for (let i = 0; i < 10; ++i) {
      posts.push({
        id: this.chance.guid(),
        text: this.chance.paragraph({sentences: this.chance.natural({min: 1, max: 10})})
      });
    }

    return of(posts);
  }
}

import { Injectable } from '@angular/core';
import { Post } from '@models/post.model';
import { Chance } from 'chance';
import { User } from '@models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  chance = new Chance();

  constructor() {
  }

  getUsers(): Observable<User[]> {
    const users: User[] = [];

    for (let i = 0; i < 10; ++i) {
      users.push(this.generateUser());
    }

    return of(users);
  }

  generateUser(): User {
    const user: User = {
      id: this.chance.guid(),
      firstName: this.chance.first(),
      lastName: this.chance.last()
    };

    return user;
  }
}

import { Injectable } from '@angular/core';
import { Post } from '@models/post.model';
import { Chance } from 'chance';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  chance = new Chance();

  constructor() {
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

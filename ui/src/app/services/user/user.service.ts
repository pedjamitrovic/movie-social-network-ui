import { Injectable } from '@angular/core';
import { Chance } from 'chance';
import { User } from '@models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  chance = new Chance();
  usersForSearch: User[] = [];

  constructor() {
    for (let i = 0; i < 100; ++i) {
      this.usersForSearch.push(this.generateUser());
    }
  }

  getUsers(): Observable<User[]> {
    const users: User[] = [];

    for (let i = 0; i < 10; ++i) {
      users.push(this.generateUser());
    }

    this.usersForSearch.push(...users);

    return of(users);
  }

  searchUsers(q: string): Observable<User[]> {
    let filteredUsers = this.usersForSearch;

    if (q) {
      filteredUsers = filteredUsers.filter(
        u => u.username.includes(q.toLowerCase())
      );
    }

    return of(filteredUsers);
  }

  generateUser(): User {
    const user: User = {
      id: this.chance.guid(),
      username: this.chance.name(),
      description: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
      profileImage: 'assets/images/vlada_profile.jpg',
      coverImage: 'assets/images/vlada_cover.jpg',
    };

    return user;
  }
}

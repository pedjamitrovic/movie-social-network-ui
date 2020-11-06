import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  generateUser(): Observable<User> {
    return of();
  }
}

import { Injectable } from '@angular/core';
import { Chance } from 'chance';
import { User } from '@models/user.model';
import { Observable, of } from 'rxjs';
import { Group } from '@models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  chance = new Chance();
  groupsForSearch: Group[] = [];

  constructor() {
    for (let i = 0; i < 100; ++i) {
      this.groupsForSearch.push(this.generateGroup());
    }
  }

  getGroups(): Observable<Group[]> {
    const groups: User[] = [];

    for (let i = 0; i < 10; ++i) {
      groups.push(this.generateGroup());
    }

    this.groupsForSearch.push(...groups);

    return of(groups);
  }

  searchGroups(q: string): Observable<Group[]> {
    let filteredGroups = this.groupsForSearch;

    if (q) {
      filteredGroups = filteredGroups.filter(
        e => e.title.includes(q.toLowerCase())
      );
    }

    return of(filteredGroups);
  }

  generateGroup(): Group {
    const group: Group = {
      id: this.chance.guid(),
      title: this.chance.name(),
      subtitle: this.chance.name(),
      description: this.chance.paragraph({ sentences: this.chance.natural({ min: 1, max: 10 }) }),
    };

    return group;
  }
}

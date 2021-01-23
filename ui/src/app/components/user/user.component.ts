import { Component, OnInit } from '@angular/core';
import { Group } from '@models/group.model';
import { User } from '@models/user.model';
import { GroupService } from '@services/group/group.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  groups: Group[];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.generateUser();
    this.groupService.getGroups().subscribe(groups => this.groups = groups);
    console.log(this.user);
  }

}

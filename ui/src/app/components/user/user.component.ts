import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '@models/group.model';
import { UserVM } from '@models/user-vm.model';
import { User } from '@models/user.model';
import { GroupService } from '@services/group/group.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: UserVM;
  groups: Group[];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.userService.getById(+params.id).subscribe((user) => this.user = user);
        this.groupService.getGroups().subscribe(groups => this.groups = groups);
      }
    )
  }

}

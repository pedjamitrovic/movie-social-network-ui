import { Component, OnInit } from '@angular/core';
import { Group } from '@models/group.model';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  group: Group;
  groups: Group[];

  constructor(
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.group = this.groupService.generateGroup();
    this.groupService.getGroups().subscribe(groups => this.groups = groups);
  }

}
